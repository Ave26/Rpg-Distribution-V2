import React, { useEffect, useState } from "react";
import Toast from "@/components/Parts/Toast";
import { userRoles } from "@prisma/client";
import { TUserResponse, TUserWithConfirmPW } from "@/types/userTypes";
import Loading from "./Parts/Loading";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { buttonStyleSubmit, InputStyle } from "@/styles/style";
import { AiOutlineLoading } from "react-icons/ai";
import useRoles from "@/hooks/useRoles";

export default function Register() {
  const { globalState } = useMyContext();
  const role = globalState?.verifiedToken?.role;

  const { roles } = useRoles();

  const [userData, setUserData] = useState<TUserResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsSHow] = useState(false);
  const [user, setUser] = useState<TUserWithConfirmPW>({
    username: "",
    password: "",
    confirmPassword: "",
    role: "default",
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
      alert(data.message);
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
        role: "default",
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

  // const inputStyle =
  //   "block w-full min-w-[20em] rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500";
  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-col gap-2 rounded-md bg-white p-2 font-semibold"
    >
      <input
        name="username"
        placeholder="Username"
        value={String(user?.username)}
        type="text"
        onChange={handleChange}
        className={InputStyle}
      />
      <input
        name="password"
        placeholder="Password"
        value={String(user?.password)}
        type="password"
        onChange={handleChange}
        className={InputStyle}
      />
      <input
        name="confirmPassword"
        placeholder="confirmPassword"
        value={String(user?.confirmPassword)}
        type="password"
        onChange={handleChange}
        className={InputStyle}
      />

      <select
        name="role"
        value={user.role || "default"}
        onChange={handleChange}
        className={InputStyle}
      >
        <option value="default" disabled>
          Pick Role
        </option>
        {Array.isArray(roles) &&
          roles.map(({ role, id }) => {
            <option value="default">Pick Role</option>;
            return (
              <option value={role} key={id}>
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
        className={InputStyle}
      />
      <input
        type="date"
        name="dob"
        placeholder="Date Of Birth"
        value={user.additionalInfo.dob}
        onChange={handleChange}
        className={InputStyle}
      />
      <input
        type="text"
        min={12}
        name="Phone_Number"
        placeholder="Phone Number"
        value={user.additionalInfo.Phone_Number}
        onChange={handleChange}
        className={InputStyle}
      />

      <button
        type="submit"
        className={`${buttonStyleSubmit} flex items-center justify-center`}
      >
        {isLoading ? (
          <AiOutlineLoading className="animate-spin text-center" size={20} />
        ) : (
          "Confirm"
        )}
      </button>
    </form>
  );
}
