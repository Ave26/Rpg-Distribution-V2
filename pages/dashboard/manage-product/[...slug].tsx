import DashboardLayout from "@/components/Admin/dashboardLayout";
import Layout from "@/components/layout";

import SubLayout from "@/Layouts/SubLayout";
import prisma from "@/lib/prisma";
import { SWRConfig } from "swr";
import { Bin, DamageBin } from "@/components/manage-rack";
import { SlugType } from "@/features/manage-product/types";
import { JSX } from "react";
import AddProduct from "@/features/manage-product/components/AddProduct";
import ScanProduct from "@/features/manage-product/components/ScanProduct";

const componentMap: Record<
  SlugType,
  (props: { slug: SlugType }) => JSX.Element
> = {
  "add-product": (props) => <AddProduct />,
  "scan-product": (props) => <ScanProduct />,
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

  const validSlugs: SlugType[] = ["add-product", "scan-product"];

  if (!validSlugs.includes(lastSegment as SlugType)) {
    return { notFound: true };
  }

  // (Optional) you could fetch API data here based on lastSegment
  const slug = lastSegment as SlugType;
  let data;
  if (slug === "add-product") {
    data = await prisma.bins.findMany({});
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
