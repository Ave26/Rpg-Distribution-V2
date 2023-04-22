import Header from "./Header";
import Footer from "./Footer";

// fetch
import useSWR from "swr";

interface LayoutProps {
  children: React.ReactNode;
  data?: any;
}

export default function Layout({ children, data }: LayoutProps) {
  return (
    <>
      <Header data={data} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
