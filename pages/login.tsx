import React, { ReactNode, useEffect, useState } from "react";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import login from "../../assets/login.jpg";
import Toast from "@/components/Parts/Toast";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/layout";

interface Auth {
  id: string;
  roles: string[];
}

export default function Login({ auth }: any) {
  const router = useRouter();
  const [data, setData] = useState<ReactNode>("");
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [show]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Layout
        data={data}
        headerBg="bg-white transition-alls"
        headerTxt="text-black hover:text-sky-500"
      >
        <section className="md:h-screen flex justify-center items-start md:justify-center font-sans h-screen">
          <div className="md:h-[37em] md:w-1/2 md:p-[5em] mt-[7em] md:mt-[1em]">
            <LoginForm setData={setData} setShow={setShow} />
            {show && <Toast data={data} />}
          </div>
        </section>
      </Layout>
    </>
  );
}
