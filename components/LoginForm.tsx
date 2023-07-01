import React, { ReactNode, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/public/assets/ProStockV2.png";
// types
import useSWR from "swr";
import ReusableInput from "./Parts/ReusableInput";

interface Auth {
  username: string;
  password: string;
}

interface StateActionData {
  setData: React.Dispatch<SetStateAction<ReactNode>>;
  setShow: React.Dispatch<SetStateAction<boolean>>;
}

export default function LoginForm({ setData, setShow }: StateActionData) {
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
      setShow(true);
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
      <div className="relative flex h-full flex-col items-center justify-center gap-4 md:p-5">
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

        <button
          type="submit"
          className="mr-2 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4 focus:ring-blue-300 hover:bg-blue-800 dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700">
          {isLoading && (
            <svg
              aria-hidden="true"
              role="status"
              className="mr-3 inline h-4 w-4 animate-spin text-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          )}
          {isLoading ? "Loading..." : "Login"}
        </button>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-b-2xl bg-sky-300 md:rounded-l-2xl md:rounded-br-none">
        <Image src={logo} alt="RPG LOGO" className="h-24 w-24" />
        <p className="break-all p-5 text-center text-xs">
          Welcome to our Warehouse Management System. Let&apos;s get started!
        </p>
      </div>
    </form>
  );
}
