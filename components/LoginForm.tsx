import React, { ReactNode, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "/public/assets/Prostocklogo.png";
// types
import useSWR from "swr";

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
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      const json = await response.json();
      console.log(json);
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
    "ring-1 ring-black px-6 py-4 rounded-sm bg-transparent border border-slate-900 text-black md:px-[3.5em] md:text-center";

  return (
    <form
      className="flex items-center justify-center w-fit h-full shadow-2xl drop-shadow-2xl rounded-2xl "
      // className="shadow-2xl rounded-lg gap-6 p-4 flex justify-center items-center flex-col h-full min-w-[22em] opacity-70 bg-transparent"
      onSubmit={handleLogin}
      onKeyDown={(e: React.KeyboardEvent) => {
        e.key === "Enter" && setBtnStyle("bg-slate-100 text-black");
      }}
      onKeyUp={(e: React.KeyboardEvent) => {
        e.key === "Enter" && setBtnStyle("");
      }}
    >
      <div className=" flex justify-center items-center flex-col gap-2 bg-sky-300 h-full w-72 px-20 rounded-l-2xl">
        <Image src={logo} alt="RPG LOGO" className="h-28 w-28" />
        <p className="text-center text-xs">
          {"Welcome to our Warehouse Management System. Let's get started!"}
        </p>
      </div>
      <div className=" flex justify-center items-center flex-col h-full p-20 gap-4 relative">
        <p className="text-xs absolute top-4 right-4 cursor-pointer">
          Need Help?
        </p>
        <h1 className="[ w-full text-center h-10">Log in</h1>
        <div className="flex items-center justify-center gap-2 flex-col">
          <label htmlFor="username" className=" w-full text-sm">
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
        <div className="flex items-center justify-center gap-2 flex-col">
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
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        >
          {isLoading && (
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 mr-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
    </form>
  );
}
