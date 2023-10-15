import React, { ReactNode, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/public/assets/ProStockV2.png";
import ReusableButton from "./Parts/ReusableButton";
import ReusableInput from "./Parts/ReusableInput";
import { LiaUser } from "react-icons/lia";
import { BiKey } from "react-icons/bi";
import Toast from "./Parts/Toast";
import { users } from "@prisma/client";
import { TAuth } from "@/types/userTypes";

type Data = {
  authenticated: boolean;
  message: string;
  user: User;
};

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

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [auth, setAuth] = useState<TAuth>({
    username: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setAuth({
      ...auth,
      [name]: value,
    });
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auth }),
      });
      const json: Data = await response.json();
      switch (response.status) {
        case 200:
          if (json?.authenticated)
            switch (json.user.roles) {
              case "SuperAdmin":
              case "Admin":
                router.push("/dashboard/log-overview");
                break;

              case "Staff":
                router.push("/dashboard/barcode-scanner");
                break;
              case "Driver":
                router.push("/dashboard/delivery-management");
              default:
                break;
            }
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
          <input
            name="username"
            value={String(auth.username)}
            placeholder="User Name"
            type="text"
            onChange={handleChange}
            className="h-full w-full appearance-none rounded-r-full bg-transparent px-2 text-start text-black placeholder-slate-600/60 outline-none"
          />
        </div>
        <div className="relative flex h-full w-full items-center justify-center gap-1 rounded-full border bg-white/20  pr-2 backdrop-blur">
          <label
            htmlFor="password"
            className="flex items-center justify-center rounded-full bg-white p-4">
            <BiKey className="h-full w-full" />
          </label>
          <input
            name="password"
            value={String(auth.password)}
            placeholder="Password"
            type="password"
            onChange={handleChange}
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
