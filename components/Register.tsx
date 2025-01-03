import React, { useEffect, useState } from "react";
import Toast from "@/components/Parts/Toast";
import { userRoles, users } from "@prisma/client";
import { TUserResponse, TUserWithConfirmPW } from "@/types/userTypes";
import Loading from "./Parts/Loading";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { buttonStyleEdge, buttonStyleSubmit, InputStyle } from "@/styles/style";
import { AiOutlineLoading } from "react-icons/ai";
import useRoles from "@/hooks/useRoles";
import Input from "./Parts/Input";

// export type User = users & {
//   confirmPassword: string;
// };

export default function Register() {
  const { globalState } = useMyContext();
  const role = globalState?.verifiedToken?.role;

  const { roles } = useRoles();

  const [userData, setUserData] = useState<TUserResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsSHow] = useState(false);
  const [user, setUser] = useState<TUserWithConfirmPW>({
    additionalInfo: { dob: "", email: "", Phone_Number: 0 },
    password: "",
    confirmPassword: "",
    role: "default",
    username: "",
  });
  const { additionalInfo } = user;
  const { Phone_Number, dob, email } = additionalInfo;

  // const [user, setUser] = useState<TUserWithConfirmPW>({
  //   username: "",
  //   password: "",
  //   confirmPassword: "",
  //   role: "default",
  //   additionalInfo: {
  //     dob: "",
  //     email: "",
  //     Phone_Number: 0,
  //   },
  // });

  // function handleChange(
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) {
  //   const { name, value } = e.target;
  //   setUser((prevUser) => {
  //     if (name in prevUser.additionalInfo) {
  //       return {
  //         ...prevUser,
  //         additionalInfo: {
  //           ...prevUser.additionalInfo,
  //           [name]: value,
  //         },
  //       };
  //     } else {
  //       return {
  //         ...prevUser,
  //         [name]: value,
  //       };
  //     }
  //   });
  // }

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
      // setUser({
      //   username: "",
      //   password: "",
      //   confirmPassword: "",
      //   role: "default",
      //   additionalInfo: {
      //     dob: "",
      //     email: "",
      //     Phone_Number: 0,
      //   },
      // });
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
  // flex h-full flex-col gap-2 rounded-md border border-green-500 bg-white p-2 font-semibold
  return (
    <form
      className="grid w-full grid-cols-1  gap-2 bg-slate-700 p-2 uppercase"
      onSubmit={(e) => {
        e.preventDefault();
        e.preventDefault();
        setIsLoading(true);

        fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then(async (res) => {
            const data: TUserResponse = await res.json();
            res.ok && setUserData(data);

            alert(data.message);
            setIsSHow(true);
            console.log(data.message);
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setIsLoading(false);

            setUser((state) => {
              return {
                ...state,
                role: "default",
                username: "",
                confirmPassword: "",
                password: "",
                additionalInfo: {
                  dob: "",
                  email: "",
                  Phone_Number: 0,
                },
              };
            });
          });

        // try {
        //   const response = await fetch("/api/user/register", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       user,
        //     }),
        //   });

        //   const data: TUserResponse = await response.json();

        //   response.ok && setUserData(data);
        //   alert(data.message);
        //   setIsSHow(true);
        //   console.log(data.message);
        // } catch (e) {
        //   console.log(e);
        // } finally {
        //   setIsLoading(false);
        //   setUser((state) => {
        //     return {
        //       ...state,
        //       role: "default",
        //       username: "",
        //       confirmPassword: "",
        //       password: "",
        //       additionalInfo: {
        //         dob: "",
        //         email: "",
        //         Phone_Number: 0,
        //       },
        //     };
        //   });
        // }
      }}
    >
      <select
        name={user.role}
        value={user.role}
        onChange={(e) => {
          const { value } = e.target;
          setUser((state) => {
            return {
              ...state,
              role: value,
            };
          });
        }}
        className={`${InputStyle} text-bolder uppercase text-white`}
      >
        <option value={"default"} disabled className="uppercase text-black">
          Select Role
        </option>
        {Array.isArray(roles) &&
          roles.map(({ id, role }) => {
            return (
              <option key={id} value={role} className="text-black">
                {role}
              </option>
            );
          })}
      </select>

      <Input
        attributes={{
          input: {
            id: "username",
            name: user.username,
            value: user.username,
            onChange: (e) => {
              const { value } = e.target;

              setUser((state) => {
                return {
                  ...state,
                  username: value,
                };
              });
            },
          },
          label: {
            htmlFor: "username",
            children: "Username",
          },
        }}
        labelStyles="uppercase text-white"
        inputStyles="uppercase text-white"
      />
      <Input
        attributes={{
          input: {
            id: "confirmPassword",
            name: user.confirmPassword,
            value: user.confirmPassword,
            type: "password",
            onChange: (e) => {
              const { value } = e.target;

              setUser((state) => {
                return {
                  ...state,
                  confirmPassword: value,
                };
              });
            },
          },
          label: {
            htmlFor: "confirmPassword",
            children: "confirmPassword",
          },
        }}
        labelStyles="uppercase text-white"
        inputStyles="uppercase text-white"
      />
      <Input
        attributes={{
          input: {
            id: "password",
            name: user.password,
            value: user.password,
            type: "password",
            onChange: (e) => {
              const { value } = e.target;

              setUser((state) => {
                return {
                  ...state,
                  password: value,
                };
              });
            },
          },
          label: {
            htmlFor: "password",
            children: "Password",
          },
        }}
        labelStyles="uppercase text-white"
        inputStyles="uppercase text-white"
      />
      <Input
        attributes={{
          input: {
            id: "dob",
            name: dob,
            value: dob,
            type: "date",
            onChange: (e) => {
              const { value } = e.target;

              setUser((state) => {
                return {
                  ...state,
                  additionalInfo: {
                    ...state.additionalInfo,
                    dob: value,
                  },
                };
              });
            },
          },
          label: {
            htmlFor: "dob",
            children: "Date Of Birth",
          },
        }}
        labelStyles="uppercase text-white"
        inputStyles="uppercase text-white"
      />
      <Input
        attributes={{
          input: {
            id: "email",
            name: email,
            value: email,
            type: "email",
            onChange: (e) => {
              const { value } = e.target;

              setUser((state) => {
                return {
                  ...state,
                  additionalInfo: {
                    ...state.additionalInfo,
                    email: value,
                  },
                };
              });
            },
          },
          label: {
            htmlFor: "email",
            children: "email",
          },
        }}
        labelStyles="uppercase text-white"
        inputStyles="uppercase text-white"
      />
      <Input
        attributes={{
          input: {
            id: "phoneNumber",
            name: String(Phone_Number),
            value: String(Phone_Number),
            type: "text",
            maxLength: 10,
            onChange: (e) => {
              const { value } = e.target;

              setUser((state) => {
                return {
                  ...state,
                  additionalInfo: {
                    ...state.additionalInfo,
                    Phone_Number:
                      !value || Number.isNaN(value) ? 0 : parseInt(value),
                  },
                };
              });
            },
          },
          label: {
            htmlFor: "phoneNumber",
            children: "Phone Number",
          },
        }}
        labelStyles="uppercase text-white"
        inputStyles="uppercase text-white"
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();

          setUser((state) => {
            return {
              ...state,
              role: "default",
              username: "",
              confirmPassword: "",
              password: "",
              additionalInfo: {
                dob: "",
                email: "",
                Phone_Number: 0,
              },
            };
          });
        }}
        className={`${buttonStyleEdge}  border-white uppercase text-white hover:bg-white hover:text-black`}
      >
        Clear
      </button>

      <button
        type="submit"
        className={`${buttonStyleEdge}  border-white uppercase text-white hover:bg-white hover:text-black`}
      >
        submit
      </button>
      <h1>{JSON.stringify(user)}</h1>
      {/* <>{JSON.stringify(additionalInfo)}</> */}
      {/* <>{JSON.stringify(isInputChanged)}</> */}
    </form>
    // <form
    //   onSubmit={handleRegister}
    //   className="flex h-full w-full flex-col gap-2 bg-white p-2 font-semibold"
    // >
    //   <input
    //     name="username"
    //     placeholder="Username"
    //     value={String(user?.username)}
    //     type="text"
    //     onChange={handleChange}
    //     className={InputStyle}
    //   />
    //   <input
    //     name="password"
    //     placeholder="Password"
    //     value={String(user?.password)}
    //     type="password"
    //     onChange={handleChange}
    //     className={InputStyle}
    //   />
    //   <input
    //     name="confirmPassword"
    //     placeholder="confirmPassword"
    //     value={String(user?.confirmPassword)}
    //     type="password"
    //     onChange={handleChange}
    //     className={InputStyle}
    //   />

    //   <select
    //     name="role"
    //     value={user.role || "default"}
    //     onChange={handleChange}
    //     className={InputStyle}
    //   >
    //     <option value="default" disabled>
    //       Pick Role
    //     </option>
    //     {Array.isArray(roles) &&
    //       roles.map(({ role, id }) => {
    //         <option value="default">Pick Role</option>;
    //         return (
    //           <option value={role} key={id}>
    //             {role}
    //           </option>
    //         );
    //       })}
    //   </select>
    //   <input
    //     type="email"
    //     name="email"
    //     placeholder="Email"
    //     value={user.additionalInfo.email}
    //     onChange={handleChange}
    //     className={InputStyle}
    //   />
    //   <input
    //     type="date"
    //     name="dob"
    //     placeholder="Date Of Birth"
    //     value={user.additionalInfo.dob}
    //     onChange={handleChange}
    //     className={InputStyle}
    //   />
    //   <input
    //     type="text"
    //     min={12}
    //     name="Phone_Number"
    //     placeholder="Phone Number"
    //     value={user.additionalInfo.Phone_Number}
    //     onChange={handleChange}
    //     className={InputStyle}
    //   />

    //   <button
    //     type="submit"
    //     className={`${buttonStyleSubmit} flex items-center justify-center`}
    //   >
    //     {isLoading ? (
    //       <AiOutlineLoading className="animate-spin text-center" size={20} />
    //     ) : (
    //       "Confirm"
    //     )}
    //   </button>
    // </form>
  );
}
