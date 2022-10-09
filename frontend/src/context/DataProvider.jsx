import React from "react";
import { useEffect } from "react";
import { createContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
const DataContext = createContext();

function DataProvider({ children }) {
  const userUrl = `https://git.heroku.com/drive-031.git/api/v1/user`;
  const folderUrl = "https://git.heroku.com/drive-031.git/api/v1/folder";
  const fileUrl = "https://git.heroku.com/drive-031.git/api/v1/file";
  const [breadCrumbArr, setBreadCrumbArr] = useState(["home/"]);
  const [historyBreadCrumbArr, setHistoryBreadCrumbArr] = useState([
    {
      folderid: "92ecc5cd5d254b2782a58ab60023e207",
      name: "home",
    },
  ]);

  const [user, setUser] = useState(null);
  let token = window.localStorage.getItem("token");

  useEffect(() => {

    // console.log("",token);


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
          // console.log(res);
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
        }
      }
      fetchData();
    } else {
      console.log("i am token");
      setUser(null);
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        token,
        breadCrumbArr,
        setBreadCrumbArr,
        historyBreadCrumbArr,
        setHistoryBreadCrumbArr,
        userUrl,
        folderUrl,
        fileUrl,
        user,
        setUser,
      }}
    >
      {children}
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
    </DataContext.Provider>
  );
}

export { DataProvider, DataContext };
