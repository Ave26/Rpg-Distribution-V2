import DashboardLayout from "@/components/Admin/dashboardLayout";
import Layout from "@/components/layout";
import {
  DeliveryLogs,
  Downloadable,
  DuplicateScans,
  OrderQueue,
  ProductStatus,
  Report,
} from "@/components/log-overview";
import { SlugType } from "@/features/log-overview";
import SubLayout from "@/Layouts/SubLayout";
import prisma from "@/lib/prisma";
import { ObjectId } from "mongodb";
import { JSX } from "react";
import { SWRConfig } from "swr";

const componentMap: Record<
  SlugType,
  (props: { slug: SlugType }) => JSX.Element
> = {
  "order-queue": (props) => <OrderQueue {...props} />,
  "product-status": (props) => <ProductStatus {...props} />,
  "delivery-logs": (props) => <DeliveryLogs {...props} />,
  "duplicate-scans": (props) => <DuplicateScans {...props} />,
  downloadable: (props) => <Downloadable {...props} />,
  report: (props) => <Report {...props} />,
};

export function DynamicProductPage({ slug }: { slug: SlugType }) {
  const Component = componentMap[slug];

  return (
    <Layout>
      <DashboardLayout>
        <SubLayout>{<Component slug={slug} />}</SubLayout>
      </DashboardLayout>
    </Layout>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Page = {
  slug: SlugType;
  fallback: any;
};
export default function Page({ slug, fallback }: Page) {
  return (
    <SWRConfig value={{ fallback, fetcher }}>
      <DynamicProductPage slug={slug} />
    </SWRConfig>
  );
}

export async function getServerSideProps(context: {
  params: { slug: string[] };
}) {
  const slugArray = context.params.slug;
  const lastSegment = slugArray[slugArray.length - 1];

  const validSlugs: SlugType[] = [
    "order-queue",
    "product-status",
    "delivery-logs",
    "duplicate-scans",
    "downloadable",
    "report",
  ];

  if (!validSlugs.includes(lastSegment as SlugType)) {
    return { notFound: true };
  }

  // (Optional) you could fetch API data here based on lastSegment
  const slug = lastSegment as SlugType;
  let data;
  if (slug === "order-queue") {
    const records = await prisma.records.findMany({
      include: {
        _count: { select: { orderedProducts: true } },
        orderedProducts: {
          include: {
            binLocations: {
              select: {
                assignedProducts: {
                  select: { status: true, barcodeId: true },
                },
                quantity: true,
              },
            },
          },
        },
      },
    });
    console.log(records[0].id);

    const recordId = new ObjectId("6767cf91121a482ac49592f9");

    const result = await prisma.records.aggregateRaw({
      pipeline: [
        {
          $group: {
            _id: "$clientName", // group by clientName
          },
        },
      ],
    });
    console.log(result);

    !records && "no response";
    data = records.map((record) => ({
      ...record,
      dateCreated: record.dateCreated?.toISOString() ?? null, // or use a helper if multiple date fields
    }));
  }

  return {
    props: {
      slug: lastSegment,
      fallback: {
        [`/api/logs/${slug}`]: data ?? [],
      },
    },
  };
}
