import DashboardLayout from "@/components/Admin/dashboardLayout";
import Layout from "@/components/layout";
import SubLayout from "@/Layouts/SubLayout";
import prisma from "@/lib/prisma";
import { SWRConfig } from "swr";
import { SortOrder, TakeOrder } from "@/components/picking-and-packing";
import { SlugType } from "@/features/picking-and-packing/types";
import AdminUI from "@/components/PickingAndPackingRole/AdminUI/Admin";
import { JSX } from "react";

const componentMap: Record<
  SlugType,
  (props: { slug: SlugType }) => JSX.Element
> = {
  "take-order": (props) => <TakeOrder />, //AdminUI
  "sort-order": (props) => <SortOrder />,
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

  const validSlugs: SlugType[] = ["take-order", "sort-order"];

  if (!validSlugs.includes(lastSegment as SlugType)) {
    return { notFound: true };
  }

  // (Optional) you could fetch API data here based on lastSegment
  const slug = lastSegment as SlugType;
  let data;
  if (slug === "take-order") {
    // data = await prisma.bins.findMany({});
    !data && "no response";
  }
  console.log(data);

  return {
    props: {
      slug: lastSegment,
      fallback: {
        [`/api/logs/${slug}`]: data ?? [],
      },
    },
  };
}
