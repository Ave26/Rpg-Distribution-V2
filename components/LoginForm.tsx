import React, { ReactNode, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/public/assets/ProStockV2.png";
import ReusableButton from "./Parts/ReusableButton";
import ReusableInput from "./Parts/ReusableInput";
import { LiaUser } from "react-icons/lia";
import { BiKey } from "react-icons/bi";
import Toast from "./Parts/Toast";

interface Auth {
  username: string;
  password: string;
}

interface Data {
  authenticated: boolean;
  message: string;
  user: User;
}

interface User {
  additional_Info: AdditionInfo;
  id: string;
  roles: string;
  username: string;
}

interface AdditionInfo {
  Dob: string;
  Phone_Number: number;
  email: string;
}

interface StateActionData {
  setData: React.Dispatch<SetStateAction<ReactNode>>;
  setShow: React.Dispatch<SetStateAction<boolean>>;
}

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [auth, setAuth] = useState<Auth>({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

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
      const json: Data = await response.json();
      switch (response.status) {
        case 200:
          if (json?.authenticated)
            switch (json.user.roles) {
              case "Admin":
                router.push("/dashboard/log-overview");
                break;

              case "staff":
                router.push("/dashboard/barcode-scanner");
                break;

              default:
                break;
            }

          setIsShow(false);

          break;
        case 401:
          console.log(json?.message);
          setMessage(json?.message);
          setIsShow(true);
          break;
        case 404:
          console.log(json.message);
          break;
        case 505:
          console.log(json.message);
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
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [isShow]);

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="flex h-full w-full flex-col items-center justify-center gap-2 break-normal p-6 font-semibold text-black backdrop-blur-lg">
        <div className="relative flex h-full w-full items-center justify-center  gap-1 rounded-full border bg-white/20 pr-2 backdrop-blur">
          <label
            htmlFor="username"
            className="flex items-center justify-center rounded-full bg-white p-4">
            <LiaUser className="h-full w-full" />
          </label>
          <ReusableInput
            id="username"
            value={auth.username}
            placeholder="User Name"
            type="text"
            onChange={(value: string) => {
              setAuth({
                ...auth,
                username: value,
              });
            }}
            className="h-full w-full appearance-none rounded-r-full bg-transparent px-2 text-start text-black placeholder-slate-600/60 outline-none"
          />
        </div>
        <div className="relative flex h-full w-full items-center justify-center gap-1 rounded-full border bg-white/20  pr-2 backdrop-blur">
          <label
            htmlFor="password"
            className="flex items-center justify-center rounded-full bg-white p-4">
            <BiKey className="h-full w-full" />
          </label>
          <ReusableInput
            id="password"
            value={auth?.password}
            placeholder="Password"
            type="password"
            onChange={(value: string) => {
              setAuth({
                ...auth,
                password: value,
              });
            }}
            className="h-full w-full appearance-none rounded-r-full bg-transparent px-2 text-start text-black placeholder-slate-600/60 outline-none"
          />
        </div>

        <ReusableButton
          name={"LOGIN"}
          isLoading={isLoading}
          type="submit"
          className="flex h-full w-full items-center justify-center self-end rounded-full border border-white/50 bg-white p-2 transition-all md:w-28"
        />
      </form>
      <Toast data={message} isShow={isShow} />
    </>
  );
}
