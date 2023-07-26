import React, { ReactNode, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/public/assets/ProStockV2.png";
import ReusableButton from "./Parts/ReusableButton";

interface Auth {
  username: string;
  password: string;
}

interface StateActionData {
  setData: React.Dispatch<SetStateAction<ReactNode>>;
  setShow: React.Dispatch<SetStateAction<boolean>>;
}
// { setData, setShow }: StateActionData
export default function LoginForm() {
  const [data, setData] = useState("");

  const router = useRouter();
  const [auth, setAuth] = useState<Auth>({
    username: "",
    password: "",
  });

  const [btnStyle, setBtnStyle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("click");

    const requestBody = JSON.stringify({
      username: auth.username,
      password: auth.password,
    });

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      const json = await response.json();
      // console.log(json);
      switch (response.status) {
        case 200:
          setData(json.message);
          router.push("/");
          localStorage.setItem("authenticated", "true");

          break;
        case 401:
          console.log(json.message);
          setData(json.message);
          break;
        case 404:
          console.log(json.message);
          setData(json.message);
          break;
        case 505:
          console.log(json.message);
          setData(json.message);
          break;
      }
    } catch (error: unknown | any) {
      console.log(error);
    } finally {
      setAuth({
        username: "",
        password: "",
      });
      setIsLoading(false);
      // setShow(true);
    }
  };
  const inputStyle =
    "ring-1 ring-black px-6 py-4 rounded-sm bg-transparent border border-slate-900 text-black md:px-[3.5em] md:text-center w-full";

  return (
    <form
      className="relative flex h-full w-fit flex-col items-center justify-center rounded-2xl font-bold shadow-2xl drop-shadow-2xl md:flex-row-reverse"
      onSubmit={handleLogin}
      onKeyDown={(e: React.KeyboardEvent) => {
        e.key === "Enter" && setBtnStyle("bg-slate-100 text-black");
      }}
      onKeyUp={(e: React.KeyboardEvent) => {
        e.key === "Enter" && setBtnStyle("");
      }}>
      <div className="relative flex h-full flex-col items-center justify-center gap-4 md:p-20">
        <h1 className="[ h-10 w-full text-center">Log in</h1>
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <label htmlFor="username" className="w-full text-sm">
            Username
          </label>
          <input
            required
            id="username"
            type="text"
            placeholder="username"
            value={auth.username}
            onChange={(e) =>
              setAuth((prevAuth) => {
                return {
                  ...prevAuth,
                  username: e.target.value,
                };
              })
            }
            className={inputStyle}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <label htmlFor="password" className=" w-full text-sm">
            Password
          </label>
          <input
            required
            id="password"
            type="password"
            placeholder="password"
            value={auth.password}
            onChange={(e) =>
              setAuth((prevAuth) => {
                return {
                  ...prevAuth,
                  password: e.target.value,
                };
              })
            }
            className={inputStyle}
          />
        </div>

        <ReusableButton name={"Log in"} type={"submit"} isLoading={isLoading} />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-b-2xl bg-sky-300 md:gap-4 md:rounded-l-2xl md:rounded-br-none">
        <Image
          src={logo}
          alt="RPG LOGO"
          className="h-24 w-24 transition-all md:h-36 md:w-36"
        />
        <p className="text-md break-words p-5 text-center md:p-1">
          Welcome to our Warehouse Management System. Let&apos;s get started!
        </p>
      </div>
    </form>
  );
}
