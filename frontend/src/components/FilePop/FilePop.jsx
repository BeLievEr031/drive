import React, { useContext, useState } from "react";
import axios from "axios";
import { DataContext } from "../../context/DataProvider";
import Style from "./FilePop.module.css";
import HashLoader from "react-spinners/HashLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function FilePop({ setIsFile, fileArr, setFilesArr }) {
  const [file, setFile] = useState(false);
  const [loader, setLoader] = useState(false);
  const { token, fileUrl, historyBreadCrumbArr } = useContext(DataContext);
  const handleUploadNewFile = async () => {
    if (!file) {
      return toast.error("File required..", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }

    try {
      setLoader(true);
      const data = new FormData();
      data.append("file", file);
      let res = await axios({
        method: "post",
        url: `${fileUrl}/upload`,
        data,
        headers: {
          token,
        },
      });

      res = res.data;

      console.log(res);
      if (res) {
        setIsFile(false);
        setLoader(false);

        toast.success(res.msg, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });

        console.log(res.user.files);
        setFilesArr([...res.user.files]);
      }
    } catch (error) {
      setIsFile(false);
      setLoader(false);
      console.log(error);
    }
  };

  const handleUploadNewSubFile = async () => {
    if (!file) {
      return toast.error("File required..", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }

    try {
      setLoader(true);
      const data = new FormData();
      data.append("file", file);
      const parentID =
        historyBreadCrumbArr[historyBreadCrumbArr.length - 1].folderid;
      let res = await axios({
        method: "post",
        url: `${fileUrl}/upload/${parentID}`,
        data,
        headers: {
          token,
        },
      });
      res = res.data;
      console.log(res.folder.subFiles);
      if (res) {
        setIsFile(false);
        setLoader(false);

        toast.success(res.msg, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });

        setFilesArr([...res.folder.subFiles]);
      }
    } catch (error) {
      setIsFile(false);
      setLoader(false);
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

  const handlePopClose = () => {
    setIsFile(false);
  };
  return (
    <>
      <div className={Style.filePop}>
        {loader ? (
          <>
            <HashLoader color="#36d7b7" size={100} />
            <h3>Uploading</h3>
          </>
        ) : (
          <div className={Style.action}>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
            <button
              onClick={
                historyBreadCrumbArr[historyBreadCrumbArr.length - 1]
                  .folderid === "92ecc5cd5d254b2782a58ab60023e207"
                  ? handleUploadNewFile
                  : handleUploadNewSubFile
              }
            >
              upload
            </button>
            <button onClick={handlePopClose}>cancle</button>
          </div>
        )}
      </div>

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

export default FilePop;
