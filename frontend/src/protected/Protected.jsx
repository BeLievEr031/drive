import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
function Protected({ Component }) {
  const { user, token, userUrl, setUser } = useContext(DataContext);
  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    if (token) {
      console.log(token);
      async function fetchData() {
        try {
          let res = await axios({
            method: "get",
            url: `${userUrl}/me`,
            headers: {
              token,
            },
          });
          res = res.data;
          console.log(res);
          setUser({
            ...res.user,
          });
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

          console.log(error);
        }
      }
      fetchData();
    } else {
      console.log("i am token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    console.log("i am a user", user);
  });

  return (
    <>
      {!user ? navigate("/") : <Component />}

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
    </>
  );
}

export default Protected;
