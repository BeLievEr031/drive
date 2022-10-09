import axios from "axios";
import React from "react";
import { useContext, useRef } from "react";
import { useState } from "react";
import { DataContext } from "../../context/DataProvider";
import Style from "./Folder.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Folder({
  folder,
  setCurrSelectedFolder,
  setClosePop,
  setFolders,
  folders,
  setIsAddFolder,
  setFilesArr,
  fileArr,
}) {
  const { fileUrl, folderUrl, token } = useContext(DataContext);
  const [isEdit, setEdit] = useState(false);
  const { historyBreadCrumbArr, setHistoryBreadCrumbArr } =
    useContext(DataContext);
  const [folderName, setFolderName] = useState("Music");
  const [delFolder, setDelFolder] = useState(false);
  const handleFolderNameChange = () => {
    setCurrSelectedFolder({
      _id: folder.folderid,
      folderName: folder.name,
    });
    setIsAddFolder(false);
    setClosePop(true);
  };

  const handleSubFolderAndSubData = async () => {
    console.log(folder);

    try {
      let res = await axios({
        method: "get",
        url: `${folderUrl}/get/sub/${folder.folderid}`,
        headers: {
          token,
        },
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

      setHistoryBreadCrumbArr([...historyBreadCrumbArr, folder]);
      console.log(historyBreadCrumbArr);

      window.localStorage.setItem(
        "breadCrumb",
        JSON.stringify([...historyBreadCrumbArr, folder])
      );
      setFolders([...res.sub_folders]);
      setEdit(false);
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

    try {
      const parentID = folder.folderid;
      let res = await axios({
        method: "get",
        url: `${fileUrl}/get/sub/${parentID}`,
        headers: {
          token,
        },
      });

      res = res.data;

      setFilesArr([...res.subFiles]);
      console.log(fileArr);
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

  const handleDelPopUp = (e) => {
    if (e.button === 0) {
      setDelFolder(!delFolder);
    }
  };

  const handleDeleteFolderFromUIAndDB = async () => {
    let filteredFolder = folders.filter((cFolder) => {
      return cFolder.folderid !== folder.folderid;
    });
    console.log(filteredFolder);
    setFolders([...filteredFolder]);
    setDelFolder(!delFolder);

    try {
      let res = await axios({
        method: "delete",
        url: `${folderUrl}/delete/${folder.folderid}`,
        headers: {
          token,
        },
      });

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

  const handleDeleteSubFolderFromUIAndDB = async () => {
    let filteredFolder = folders.filter((cFolder) => {
      return cFolder.folderid !== folder.folderid;
    });

    const parentID =
      historyBreadCrumbArr[historyBreadCrumbArr.length - 1].folderid;
    try {
      let res = await axios({
        method: "delete",
        url: `${folderUrl}/delete/${parentID}/${folder.folderid}`,
        headers: {
          token,
        },
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

      setFolders([...filteredFolder]);
      setDelFolder(!delFolder);
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
    <>
      <div className={Style.container}>
        <span
          onDoubleClick={handleSubFolderAndSubData}
          className={`material-symbols-outlined ${Style.folder}`}
        >
          folder
          <span
            onClick={(e) => handleDelPopUp(e)}
            className="material-symbols-outlined"
          >
            delete
          </span>
        </span>

        <div
          onClick={() => {
            console.log(545);
          }}
          className={Style.name}
          onDoubleClick={handleFolderNameChange}
        >
          {folder.name}
        </div>
      </div>

      <div
        className={Style.confirm_cont}
        style={delFolder ? { display: "flex" } : { display: "none" }}
      >
        <div className={Style.action_box}>
          <b
            style={{
              color: "red",
            }}
          >
            All Other Files will deleted
          </b>
          <h4>Do you really want to delete?</h4>

          <div className={Style.confirm_btn}>
            <button onClick={() => setDelFolder(!delFolder)}>cancle</button>
            <button
              onClick={
                historyBreadCrumbArr[historyBreadCrumbArr.length - 1]
                  .folderid === "92ecc5cd5d254b2782a58ab60023e207"
                  ? handleDeleteFolderFromUIAndDB
                  : handleDeleteSubFolderFromUIAndDB
              }
            >
              Delete
            </button>
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

export default Folder;
