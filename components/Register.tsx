import React, { useEffect, useState } from "react";
import Toast from "@/components/Parts/Toast";
import { UserRole } from "@prisma/client";
import { TUserResponse, TUserWithConfirmPW } from "@/types/userTypes";
import Loading from "./Parts/Loading";
import { useMyContext } from "@/contexts/AuthenticationContext";

export default function Register() {
  const { globalState } = useMyContext();
  const role = globalState?.verifiedToken?.roles;
  const roles = ["Admin", "Staff", "Driver"];
  const roleMapping = roles.filter((r) => r !== role);
  const [userData, setUserData] = useState<TUserResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsSHow] = useState(false);
  const [user, setUser] = useState<TUserWithConfirmPW>({
    username: "",
    password: "",
    confirmPassword: "",
    roles: "Staff",
    additionalInfo: {
      dob: "",
      email: "",
      Phone_Number: 0,
    },
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setUser((prevUser) => {
      if (name in prevUser.additionalInfo) {
        return {
          ...prevUser,
          additionalInfo: {
            ...prevUser.additionalInfo,
            [name]: value,
          },
        };
      } else {
        return {
          ...prevUser,
          [name]: value,
        };
      }
    });
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
        }),
      });

      const data: TUserResponse = await response.json();

      response.ok && setUserData(data);
      setIsSHow(true);
      console.log(data.message);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      setUser({
        username: "",
        password: "",
        confirmPassword: "",
        roles: "Staff",
        additionalInfo: {
          dob: "",
          email: "",
          Phone_Number: 0,
        },
      });
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSHow(false);
    }, 1600);

    return;
  }, [isShow]);

  const inputStyle =
    "block w-full min-w-[20em] rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500";
  return (
    <>
      <form
        onSubmit={handleRegister}
        className="flex h-full w-full flex-col gap-2 p-2 font-semibold text-black">
        <input
          name="username"
          placeholder="Username"
          value={String(user?.username)}
          type="text"
          onChange={handleChange}
          className={inputStyle}
        />
        <input
          name="password"
          placeholder="Password"
          value={String(user?.password)}
          type="password"
          onChange={handleChange}
          className={inputStyle}
        />
        <input
          name="confirmPassword"
          placeholder="confirmPassword"
          value={String(user?.confirmPassword)}
          type="password"
          onChange={handleChange}
          className={inputStyle}
        />
        <select
          name="roles"
          value={user.roles as UserRole}
          onChange={handleChange}
          className={inputStyle}>
          {roleMapping.map((role, index) => {
            return (
              <option value={role} key={index}>
                {role}
              </option>
            );
          })}
        </select>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.additionalInfo.email}
          onChange={handleChange}
          className={inputStyle}
        />
        <input
          type="date"
          name="dob"
          placeholder="Date Of Birth"
          value={user.additionalInfo.dob}
          onChange={handleChange}
          className={inputStyle}
        />
        <input
          type="text"
          min={12}
          name="Phone_Number"
          placeholder="Phone Number"
          value={user.additionalInfo.Phone_Number}
          onChange={handleChange}
          className={inputStyle}
        />

        <button
          type="submit"
          className="flex h-fit w-full items-center justify-center rounded-md border border-sky-400 p-2 transition-all hover:border-transparent hover:bg-sky-300">
          {isLoading ? <Loading /> : "Confirm"}
        </button>
      </form>

      <Toast data={userData?.message} isShow={isShow} />
    </>
  );
}
