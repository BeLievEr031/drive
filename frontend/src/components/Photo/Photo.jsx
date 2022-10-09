import React, { useContext } from "react";
import Style from "./Photo.module.css";
import radhe from "./radhe.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { DataContext } from "../../context/DataProvider";
function Photo({ file, fileArr, setFilesArr }) {
  const { token, fileUrl, historyBreadCrumbArr, setHistoryBreadCrumbArr } =
    useContext(DataContext);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(file.file_url);
      toast.success("Url Copied To ClipBoard", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    } catch (error) {
      toast.error(error.message, {
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

  const handleFileDeleteUIAndDB = async () => {
    console.log(file);

    let res = await axios({
      method: "delete",
      url: `${fileUrl}/delete/${file.public_id}`,
      headers: {
        token,
      },
    });
    console.log(res);

    const filteredArr = fileArr.filter((cFile) => {
      return cFile.public_id !== file.public_id;
    });
    setFilesArr([...filteredArr]);
  };

  const handleSubFilDeleteUIAndDB = async () => {
    const parentID =
      historyBreadCrumbArr[historyBreadCrumbArr.length - 1].folderid;
    let res = await axios({
      method: "delete",
      url: `${fileUrl}/delete/sub/${parentID}/${file.public_id}`,
      headers: {
        token,
      },
    });

    const filteredArr = fileArr.filter((cFile) => {
      return cFile.public_id !== file.public_id;
    });
    setFilesArr([...filteredArr]);
  };
  return (
    <>
      <div className={Style.container}>
        <div className={Style.img_cont}>
          <img src={file.file_url} alt="" />

          <div className={Style.action}>
            <span
              className="material-symbols-outlined"
              onClick={
                historyBreadCrumbArr[historyBreadCrumbArr.length - 1]
                  .folderid === "92ecc5cd5d254b2782a58ab60023e207"
                  ? handleFileDeleteUIAndDB
                  : handleSubFilDeleteUIAndDB
              }
            >
              delete
            </span>
            <a
              href={file.file_url}
              target="_blank"
              style={{
                color: "white",
              }}
            >
              <span className="material-symbols-outlined">preview</span>
            </a>
            <span className="material-symbols-outlined" onClick={handleShare}>
              share
            </span>
          </div>
        </div>
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

export default Photo;
