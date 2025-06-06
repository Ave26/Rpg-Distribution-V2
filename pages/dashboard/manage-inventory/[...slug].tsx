import DashboardLayout from "@/components/Admin/dashboardLayout";
import Layout from "@/components/layout";

import SubLayout from "@/Layouts/SubLayout";
import prisma from "@/lib/prisma";
import { SWRConfig } from "swr";
import { Bin, DamageBin, Product } from "@/components/manage-inventory";
import { TSlug } from "@/features/manage-inventory";
import ProductInventory from "@/components/Inventory/ProductInventory";
import DamageInventory from "@/components/Inventory/DamageInventory";
import BinInventory from "@/components/Inventory/BinInventory";

const componentMap: Record<TSlug, (props: { slug: TSlug }) => JSX.Element> = {
  bin: (props) => <Bin />,
  "damage-bin": (props) => <BinInventory />,
  product: (props) => <BinInventory />,
};

export function DynamicProductPage({ slug }: { slug: TSlug }) {
  console.log(slug);
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
  slug: TSlug;
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

  const validSlugs: TSlug[] = ["bin", "damage-bin", "product"];

  if (!validSlugs.includes(lastSegment as TSlug)) {
    return { notFound: true };
  }

  // (Optional) you could fetch API data here based on lastSegment
  const slug = lastSegment as TSlug;
  let data;
  // if (slug === "bin") {
  //   data = await prisma.bins.findMany({});
  //   !data && "no response";
  // }
  // console.log(data);

  return {
    props: {
      slug: lastSegment,
      fallback: {
        [`/api/logs/${slug}`]: data ?? [],
      },
    },
  };
}
