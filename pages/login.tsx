import React, { ReactNode, useEffect, useState } from "react";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import login from "../../assets/login.jpg";
import Toast from "@/components/Toast";
import Head from "next/head";

interface Auth {
  id: string;
  roles: string[];
}

export default function Login({ auth }: any) {
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
      <section className="w-full h-screen md:h-full flex justify-center items-start md:justify-end font-sans font-extrabold">
        <div className="md:h-[37em] md:w-1/2 md:p-[5em] mt-[2em] md:mt-[.5em] md:mr-28">
          <LoginForm setData={setData} setShow={setShow} />
          {show && <Toast data={data} />}
        </div>
      </section>
    </>
  );
}
