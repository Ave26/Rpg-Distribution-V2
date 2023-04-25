import React, { useState } from "react";
import Layout from "@/components/layout";

export default function AccountManagement() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [Dob, setDob] = useState<string>("");
  const [Phone_Number] = useState<number>(0);
  const [email, setEmail] = useState<string>("");

  const additional_Info = JSON.stringify({
    Dob: Dob,
    Phone_Number: Phone_Number,
    email: email,
  });

  const requestBody = JSON.stringify({
    username: username,
    password: password,
    additional_Info: additional_Info,
  });

  const handleRegister = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  const inputStyle = "";
  return (
    <Layout>
      <div className="w-full h-screen flex justify-center font-bold mt-16">
        <form
          action=""
          onSubmit={handleRegister}
          className="flex justify-center items-center flex-col border w-1/2 h-2/3 hover:shadow-lg shadow-md gap-3"
        >
          <div className="flex justify-center items-center">
            <section className="border flex justify-center items-center h-full w-full flex-col p-4">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="p-5 border-2 rounded-xl "
              />
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="p-5 border-2 rounded-xl "
              />
              <label htmlFor="confirm password">Confirm Password</label>
              <input
                id="confirm password"
                type="confirm password"
                className="p-5 border-2 rounded-xl "
              />
            </section>
            <section className="border flex justify-center items-center h-full w-full flex-col p-4">
              <label htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                type="date"
                placeholder="username"
                className="p-3 border-2 rounded-xl "
              />
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                className="p-3 border-2 rounded-xl "
              />
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="p-3 border-2 rounded-xl "
              />
            </section>
          </div>
          <button
            type="submit"
            className="w-full justify-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
          >
            {/* {isLoading ? (
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
            ) : (
              "Save"
            )} */}
            save
          </button>
        </form>
      </div>
      ;
    </Layout>
  );
}

// {
//   "username": "admin9",
//   "password": "admin",
// 	  "additional_Info": {
//     "Dob": "01/01/2000",
//     "Phone_Number": 1234567890,
//     "email": "admin@yahoo.com"
//   }
// }
