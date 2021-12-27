import React, { useState } from "react";
import axios from "axios";
import { Input, Space, Button, notification } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
} from "@ant-design/icons";

//redux
import { useDispatch } from "react-redux";
import { login } from "../reducers/userSlice";

//Bas url for post request
const baseUrl = "https://face.ox-sys.com/security/auth_check";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //Get token from storage
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  //When error show notification
  const openNotification = (type) => {
    notification[type]({
      message: "Error",
      description: "Your entered credentials is invalid, please reenter",
    });
  };
  //Params
  const params = new URLSearchParams();
  params.append("_username", username);
  params.append("_password", password);
  params.append("_subdomain", "face");
  // Login handler function
  const loginHandler = async (e) => {
    e.preventDefault();

    //axios post request
    await axios
      .post(baseUrl, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
      })
      .then(() => {
        setUsername("");
        setPassword("");
      })
      .catch((err) => {
        openNotification("error");
      });
  };
  //send token to redux store
  dispatch(login(token));
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-white text-3xl pb-4">
        <span className="text-sky-300">LogIn</span> to continue
      </h3>
      <form action="" onSubmit={loginHandler}>
        <Space direction="vertical" className="">
          <Input
            placeholder="Username"
            prefix={<UserOutlined />}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
          />
          <Input.Password
            placeholder="Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button htmlType="submit" className="text-white px-6 ">
            Log In
          </Button>
        </Space>
      </form>
    </div>
  );
};

export default Login;
