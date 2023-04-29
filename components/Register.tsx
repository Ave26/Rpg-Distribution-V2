import React, { useState } from "react";

interface RegisterForm {
  id: string;
  additional_Info: {
    Dob: string;
    Phone_Number: string;
    email: string;
  };
  password: string;
  roles: string[];
  username: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    id: "",
    additional_Info: {
      Dob: "",
      Phone_Number: "",
      email: "",
    },
    password: "",
    roles: [],
    username: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle form submission here
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="text"
            id="dob"
            value={formData.additional_Info.Dob}
            onChange={(e) =>
              setFormData({
                ...formData,
                additional_Info: {
                  ...formData.additional_Info,
                  Dob: e.target.value,
                },
              })
            }
          />
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={formData.additional_Info.Phone_Number}
            onChange={(e) =>
              setFormData({
                ...formData,
                additional_Info: {
                  ...formData.additional_Info,
                  Phone_Number: e.target.value,
                },
              })
            }
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.additional_Info.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                additional_Info: {
                  ...formData.additional_Info,
                  email: e.target.value,
                },
              })
            }
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;