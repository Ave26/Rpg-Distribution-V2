import React, { ReactElement, useEffect, useState } from "react";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import Register from "@/components/Register";
import userUserTracker from "@/hooks/useUserTracker";
import {
  buttonStyleDark,
  buttonStyleEdge,
  buttonStyleSubmit,
  InputStyle,
} from "@/styles/style";
import { FaUserPlus } from "react-icons/fa";
import { RiUser4Fill } from "react-icons/ri";
import { AiOutlineLoading } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import useRoles from "@/hooks/useRoles";
import { mutate } from "swr";
import Input from "@/components/Parts/Input";
import { IoRemoveSharp } from "react-icons/io5";
import { userRoles, users } from "@prisma/client";
import { User } from "../api/user/update";

type UserButton = {
  operation: Operation;
  id: string;
  action: Actions | "default";
};

type Operation = "MOVE" | "SELECT" | "CANCEL" | "ACTION" | "UPDATE";

type Actions = "MERGE" | "CLEAR";

const AccountManagement = () => {
  const { users, error, isLoading } = userUserTracker();

  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [isInputChanged, setIsInputChanged] = useState(false);

  const [userButton, setUserButton] = useState<UserButton>({
    action: "default",
    id: "",
    operation: "ACTION",
  });

  const [{ additionalInfo, ...user }, setUser] = useState<User>({
    additionalInfo: { dob: "", email: "", Phone_Number: 0 },
    role: "default",
    username: "",
    id: "",
  });

  return (
    <section
      className={`flex h-full w-full grid-cols-2 gap-2 rounded-b-none rounded-t-md bg-slate-300`}
    >
      {/* header icons */}
      <div className="borded flex h-[8%] w-full justify-between rounded-t-md border-black bg-white p-2">
        <RiUser4Fill
          size={30}
          className="flex h-full animate-emerge  items-center justify-center"
        />

        <div className="flex h-full gap-2">
          <div className="flex flex-none items-center justify-center">
            <button
              className={`${buttonStyleDark}`}
              onClick={() => setOpenCreateUser(!openCreateUser)}
            >
              <FaUserPlus size={20} />
            </button>
          </div>
        </div>
      </div>
      {/* Register and RolesForm */}
      <div
        className={`${
          openCreateUser ? "sm:flex" : "hidden"
        } borded flex h-full w-full flex-col gap-2 border-black p-2`}
      >
        <Register />
        <RolesForm />
      </div>
      {/* Users Display */}
      <div
        className={` ${""} borded flex h-[15em] w-full flex-col gap-2 border-black  uppercase`}
      >
        {Array.isArray(users) &&
          users.map((u) => {
            return (
              <div
                key={u.id}
                className="parent flex flex-col rounded-md bg-white uppercase"
              >
                <ul key={u.id} className="flex">
                  <div className="rounded-y-md grid w-5/6 grid-cols-2 rounded-l-md  p-2 text-sm">
                    <li>{u.id}</li>
                    <li>{u.roles}</li>
                    <li>{u.username}</li>
                  </div>
                  <button
                    onClick={() => {
                      const operationFields: Record<Operation, () => void> = {
                        ACTION: () => {
                          setUserButton({
                            ...userButton,
                            id: u.id === userButton.id ? "" : u.id,
                            operation: "CANCEL",
                          });

                          setUser({
                            additionalInfo: {
                              dob: "",
                              email: "",
                              Phone_Number: 0,
                            },
                            role: "default",
                            username: "",
                            id: "",
                          });
                        },
                        CANCEL: () => {
                          setUserButton({
                            ...userButton,
                            id: u.id === userButton.id ? "" : u.id,
                            operation: "CANCEL",
                          });
                          setUser({
                            additionalInfo: {
                              dob: "",
                              email: "",
                              Phone_Number: 0,
                            },
                            role: "default",
                            username: "",
                            id: u.id,
                          });
                        },
                        MOVE: () => {},
                        SELECT: () => {},
                        UPDATE: () => {
                          if (u.id === userButton.id) {
                            setLoading(true);
                            fetch("/api/user/update", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                additionalInfo,
                                ...user,
                              }),
                            })
                              .then(async (res) => {
                                const data = await res.json();
                                alert(data);
                              })
                              .finally(() => {
                                setLoading(false);
                              });
                          }
                        },
                      };

                      operationFields[userButton.operation]();
                    }}
                    className="border-l-1 flex w-3/6 select-none items-center justify-center rounded-r-md border border-y-0 border-r-0 p-2 hover:bg-sky-400 md:w-1/6"
                  >
                    {userButton.id === u.id ? (
                      loading ? (
                        <AiOutlineLoading className="animate-spin" size={30} />
                      ) : (
                        userButton.operation
                      )
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </button>
                </ul>

                <div
                  className={`flex ${
                    userButton.id === u.id
                      ? "h-fit border border-t-2 p-2"
                      : "h-0"
                  } justify-between rounded-md bg-slate-700 transition-all ease-in-out`}
                >
                  <div
                    className={`${
                      userButton.id === u.id ? "block" : "hidden"
                    } flex min-w-full animate-emerge gap-2 transition-all`}
                  >
                    <UserForm
                      states={{
                        setUserButton,
                        userButton,
                        // isInputChanged,
                        // setIsInputChanged,
                        setUser,
                        user: { additionalInfo, ...user },
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default AccountManagement;

AccountManagement.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};

function RolesForm() {
  return (
    <>
      <div className="grid h-full bg-white">
        {/* <button className={buttonStyleEdge}>Create Damage Category</button> */}
        <div className="w-1/2"></div>
        <div className="grid grid-flow-row grid-cols-2 rounded-md p-2">
          <UserRoleForm />
          <div className="col-span-2 row-span-6 flex h-[20em] flex-col gap-2 overflow-y-scroll border border-b-0 border-r-0 border-t-0 border-black p-2">
            {/* <ViewCategories categories={categories} /> */}
            <ViewRoles />
          </div>
        </div>

        {/* {JSON.stringify(bin, null, 2)} */}
      </div>
    </>
  );
}

function UserRoleForm() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  return (
    <form
      className="col-span-2 flex gap-2 p-2"
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);

        fetch("/api/user/create-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(role),
        })
          .then(async (res) => {
            const data = await res.json();
            res.ok && alert(data);
          })
          .catch((e) => console.error(e))
          .finally(() => {
            mutate("/api/user/roles");
            setLoading(false);
          });
      }}
    >
      <Input
        attributes={{
          input: {
            id: role,
            type: "text",
            name: role,
            value: role,
            onChange: (e) => setRole(e.target.value),
          },
          label: { htmlFor: role, children: "Role" },
        }}
        inputStyles="uppercase"
      />
      <button type="submit" className={buttonStyleSubmit}>
        {loading ? (
          <div className="flex items-center justify-center">
            <AiOutlineLoading className="animate-spin" size={30} />
          </div>
        ) : (
          "submit"
        )}
      </button>
    </form>
  );
}

function ViewRoles() {
  const { roles } = useRoles();
  const [selectedRole, setSelectedRole] = useState("");
  console.log(roles);
  return (
    <>
      {Array.isArray(roles) &&
        roles.map(({ id, role }) => {
          return (
            <div
              className="flex flex-col items-end justify-between gap-2 p-2 hover:bg-slate-200"
              key={id}
              onClick={() => {
                setSelectedRole(id);

                if (selectedRole === id) {
                  setSelectedRole("");
                }
              }}
            >
              <div className="flex w-full justify-between gap-2">
                <div className="flex w-full justify-between">
                  <li>{role}</li>
                </div>

                <button
                  onClick={() => {
                    fetch("/api/user/delete-role", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(role.toUpperCase()),
                    })
                      .then(async (res) => {
                        const data = await res.json();
                        res.ok && alert(data);
                      })
                      .finally(() => {
                        setSelectedRole("");
                        mutate("/api/user/roles");
                      });
                  }}
                >
                  <IoRemoveSharp className="transition-all hover:scale-150 active:scale-100" />
                </button>
              </div>
            </div>
          );
        })}
    </>
  );
}

interface UserFormProps {
  states: {
    setUser: React.Dispatch<React.SetStateAction<User>>;
    user: User;
    // setIsInputChanged: React.Dispatch<React.SetStateAction<boolean>>;
    // isInputChanged: boolean;
    setUserButton: React.Dispatch<React.SetStateAction<UserButton>>;
    userButton: UserButton;
  };
}

function UserForm({ states }: UserFormProps) {
  const { roles } = useRoles();
  const {
    setUserButton,
    userButton,
    setUser,
    user: { additionalInfo, ...user },
  } = states;

  const { Phone_Number, dob, email } = additionalInfo;
  states.user;
  // useEffect(() => {
  //   const { id, ...restOfUser } = states.user; // Exclude `id`
  //   const hasChanges = Object.values(restOfUser).some((value) => {
  //     if (typeof value === "object" && value !== null) {
  //       return Object.values(value).some(
  //         (nestedValue) => nestedValue !== "default" && !!nestedValue
  //       );
  //     }
  //     return value !== "default" && !!value;
  //   });

  //   setUserButton((state) => ({
  //     ...state,
  //     operation: hasChanges ? "UPDATE" : "CANCEL",
  //   }));
  // }, [states.user, setUserButton]);
  // Ensure the dependency matches the actual state

  return (
    <form className="grid w-full grid-cols-2 gap-2 uppercase">
      <select
        name={user.role}
        value={user.role}
        onChange={(e) => {
          setUser((state) => {
            return {
              ...state,
              role: e.target.value,
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

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setUser((state) => {
            return {
              ...state,
              role: "default",
              username: "",
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
      <Input
        attributes={{
          input: {
            id: "username",
            name: user.username,
            value: user.username,
            onChange: (e) => {
              setUser((state) => {
                return {
                  ...state,
                  username: e.target.value,
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
            id: "dob",
            name: dob,
            value: dob,
            type: "date",
            onChange: (e) => {
              setUser((state) => {
                return {
                  ...state,
                  additionalInfo: {
                    ...state.additionalInfo,
                    dob: e.target.value,
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
              setUser((state) => {
                return {
                  ...state,
                  additionalInfo: {
                    ...state.additionalInfo,
                    email: e.target.value,
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
              setUser((state) => {
                return {
                  ...state,
                  additionalInfo: {
                    ...state.additionalInfo,
                    Phone_Number: !e.target.value
                      ? 0
                      : parseInt(e.target.value),
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

      <h1>{JSON.stringify(user)}</h1>
      {/* <>{JSON.stringify(additionalInfo)}</> */}
      {/* <>{JSON.stringify(isInputChanged)}</> */}
    </form>
  );
}
