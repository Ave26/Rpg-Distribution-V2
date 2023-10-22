import Layout from "@/components/layout";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import aboutus from "../public/assets/Finally.png";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiRequest } from "next";
export default function About({ data }: any) {
  return (
    <>
      <Head>
        <title>About Us | MyCompany</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-center justify-center rounded-md border-black bg-white shadow-md lg:flex-row">
          <div className="p-10 lg:w-[50%]">
            <Image src={aboutus} alt="About Us" className="h-full w-full" />
          </div>
          <section
            className={`item-center flex w-[80%] flex-col justify-center gap-5`}>
            <h1 className={"text-3xl "}>Who We Are</h1>
            <p className={" font-roboto leading-relaxed  text-black"}>
              <strong className="text-3xl text-yellow-400">W</strong>elcome to{" "}
              <strong className="text-3xl text-yellow-400">ProStock</strong>! We
              are a team of experienced professionals
              {` dedicated to providing efficient and effective Warehouse Management solutions
          for businesses of all sizes. Our mission is to help our clients
          streamline their operations and achieve their goals by providing
          comprehensive management tools and services. At our core, we believe
          that successful management is about more than just overseeing
          operations. It's about understanding the unique needs and challenges
          of each business and tailoring our approach to meet those needs. We
          take a collaborative and proactive approach to management, working
          closely with our clients to identify opportunities for improvement
          and develop strategies that deliver results.`}
            </p>
            <h2 className={"text-3xl "}>Our Expertise</h2>
            <p className={"leading-relaxed text-black  "}>
              <strong className="text-3xl text-yellow-400">O</strong>ur team has
              a wealth of experience in a variety of industries and can help you
              navigate complex challenges and capitalize on new opportunities.
              From project management to financial planning and analysis, we
              have the expertise you need to succeed.
            </p>
            <h2 className={"text-3xl  "}> Our Promise</h2>
            <p className={"leading-relaxed text-black  "}>
              {` Whether you're a small startup or a large corporation, we're here to
              help you achieve your goals. We promise to provide you with
              personalized service and solutions that are tailored to your unique
              needs. We'll work with you every step of the way to ensure your
              success.`}
            </p>
          </section>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const { verifiedToken }: any = await verifyJwt(req);
  let data = {};
  if (verifiedToken) {
    data = {
      isLogin: true,
      verifiedToken,
    };
  } else {
    data = {
      isLogin: false,
    };
  }
  return {
    props: {
      data,
    },
  };
};
