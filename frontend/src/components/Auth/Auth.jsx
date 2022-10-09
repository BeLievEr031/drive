import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { DataContext } from "../../context/DataProvider";
import axios from "axios";
import Style from "./Auth.module.css";
import { validate } from "react-email-validator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
function Auth() {
  const navigate = useNavigate();
  const { userUrl, setUser } = useContext(DataContext);
  const [auth, setAuth] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleLoginRender = () => {
    setAuth(!auth);
  };

  const handleSetSignUpUser = (e) => {
    setValidEmail(validate(signUpData.email));

    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSetLoginUser = (e) => {
    setValidEmail(validate(loginData.email));

    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUpUser = async () => {
    setValidEmail(validate(signUpData.email));

    if (
      !validEmail ||
      signUpData.name === "" ||
      signUpData.password === "" ||
      signUpData.email === ""
    ) {
      return toast.error(
        validEmail ? "All fields Required.." : "Enter valid email please..",
        {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        }
      );
    }

    try {
      let res = await axios({
        method: "post",
        url: `${userUrl}/register`,
        data: { ...signUpData },
      });

      res = res.data;

      if (!res.success) {
        return toast.error(res.msg, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }

      toast.success(res.msg, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      setAuth(true);
    } catch (error) {
      const errorRes = error.response.data;
      return toast.error(errorRes.msg, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  };

  const handleLoginUser = async () => {
    setValidEmail(validate(loginData.email));

    if (!validEmail || loginData.password === "" || loginData.email === "") {
      return toast.error(
        validEmail ? "All fields Required.." : "Enter valid email please..",
        {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        }
      );
    }

    try {
      let res = await axios({
        method: "post",
        url: `${userUrl}/login`,
        data: loginData,
      });
      console.log(res);
      res = res.data;

      if (!res.success) {
        return toast.error(res.msg, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }

      toast.success(res.msg, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      setUser(res.user);
      window.localStorage.setItem("token", res.token);
      navigate("/home")
    } catch (error) {
      const errorRes = error.response.data;
      return toast.error(errorRes.msg, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  };
  return (
    <div className={Style.container}>
      {auth ? (
        <div className={Style.auth}>
          <h1>Login</h1>
          <input
            onChange={(e) => {
              handleSetLoginUser(e);
            }}
            value={loginData.email}
            type="email"
            name="email"
            placeholder="email"
          />
          <input
            onChange={(e) => {
              handleSetLoginUser(e);
            }}
            value={loginData.password}
            type="password"
            name="password"
            placeholder="password"
          />

          <button onClick={handleLoginUser} className={Style.btn}>
            Login{" "}
          </button>
          <span onClick={handleLoginRender} className={Style.login}>
            Create An Account
          </span>
        </div>
      ) : (
        <div className={Style.auth}>
          <h1>SignUp</h1>
          <input
            onChange={(e) => {
              handleSetSignUpUser(e);
            }}
            value={signUpData.name}
            type="text"
            name="name"
            placeholder="name"
          />
          <input
            onChange={(e) => {
              handleSetSignUpUser(e);
            }}
            value={signUpData.email}
            type="email"
            name="email"
            placeholder="email"
          />
          <input
            onChange={(e) => {
              handleSetSignUpUser(e);
            }}
            value={signUpData.password}
            type="password"
            name="password"
            placeholder="password"
          />

          <button onClick={handleSignUpUser} className={Style.btn}>
            SignUp
          </button>
          <span onClick={handleLoginRender} className={Style.login}>
            login
          </span>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Auth;
