import Header from "./Header";
import Footer from "./Footer";

// fetch
import useSWR from "swr";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
  data?: any;
  headerBg?: string;
  headerTxt?: string;
}

export default function Layout({
  children,
  data,
  headerBg,
  headerTxt,
}: LayoutProps) {
  return (
    <>
      <Header data={data} headerBg={headerBg} headerTxt={headerTxt} />
      <main className="h-full w-full font-extrabold">{children}</main>
      <Footer />
    </>
  );
}
