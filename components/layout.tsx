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
  headerSky?: string;
  footerSky?: string;
}

export default function Layout({
  children,
  data,
  headerBg,
  headerTxt,
  headerSky,
  footerSky,
}: LayoutProps) {
  return (
    <>
      <Header
        data={data}
        headerBg={headerBg}
        headerTxt={headerTxt}
        headerSky={headerSky}
      />
      <main className="h-full w-full font-extrabold">{children}</main>
      <Footer footerSky={footerSky} />
    </>
  );
}
