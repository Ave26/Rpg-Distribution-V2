import Header from "./Header";
import Footer from "./Footer";

// fetch
import useSWR from "swr";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
  data?: any;
}

export default function Layout({ children, data }: LayoutProps) {
  // useEffect(() => {
  //   console.log("rerender triggers");
  // }, []);

  return (
    <>
      <Header data={data} />
      <main className="h-full w-full font-extrabold">{children}</main>
      <Footer />
    </>
  );
}
