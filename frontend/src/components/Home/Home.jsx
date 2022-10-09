import React from "react";
import { useState } from "react";
import Folder from "../Folder/Folder";
import Navbar from "../Navbar/Navbar";
import Pop from "../Pop/Pop";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import Style from "./Home.module.css";
import axios from "axios";
import { useContext } from "react";
import { DataContext } from "../../context/DataProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import Photo from "../Photo/Photo";
function Home() {
  const {
    fileUrl,
    folderUrl,
    token,
    historyBreadCrumbArr,
    setHistoryBreadCrumbArr,
  } = useContext(DataContext);
  const [currSelectedFolder, setCurrSelectedFolder] = useState({
    _id: 0,
    folderName: "",
  });
  const [closePop, setClosePop] = useState(false);
  const [updtFolder, setUpdtFolder] = useState("");
  const [isAddFolder, setIsAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const [fileArr, setFilesArr] = useState([]);

  // initially fetching all the users folder
  useEffect(() => {
    async function fetchData() {
      if (
        historyBreadCrumbArr[historyBreadCrumbArr.length - 1].folderid ===
        "92ecc5cd5d254b2782a58ab60023e207"
      ) {
        try {
          let res = await axios({
            method: "get",
            url: `${folderUrl}/get`,
            headers: {
              token,
            },
          });

          res = res.data.folders;

          console.log(res);

          setFolders([...res.folders]);
        } catch (error) {
          console.log(error.data);
        }
      } else {
        try {
          let res = await axios({
            method: "get",
            url: `${folderUrl}/get/sub/${
              historyBreadCrumbArr[historyBreadCrumbArr.length - 1].folderid
            }`,
            headers: {
              token,
            },
          });

          res = res.data;

          console.log(res);

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

          setFolders([...res.sub_folders]);
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
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (
        historyBreadCrumbArr[historyBreadCrumbArr.length - 1].folderid ===
        "92ecc5cd5d254b2782a58ab60023e207"
      ) {
        try {
          let res = await axios({
            method: "get",
            url: `${fileUrl}/get`,
            headers: {
              token,
            },
          });

          res = res.data.files;

          setFilesArr([...res]);

          console.log(fileArr);
        } catch (error) {
          console.log(error.data);
        }
      } else {
        try {
          let res = await axios({
            method: "get",
            url: `${fileUrl}/get/sub/${
              historyBreadCrumbArr[historyBreadCrumbArr.length - 1].folderid
            }`,
            headers: {
              token,
            },
          });

          res = res.data.subFiles;

          console.log(res);

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

          setFilesArr([...res]);
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
    }

    fetchData();
  }, []);

  const handleClosePop = () => {
    console.log(folders);
    setClosePop(false);
  };

  const handleFolderChangeName = async () => {
    if (currSelectedFolder.folderName.trim().length === 0) {
      return alert("all fields required");
    }

    console.log(currSelectedFolder);

    let [folder] = folders.filter((folder) => {
      return folder.folderid === currSelectedFolder._id;
    });

    try {
      let res = await axios({
        method: "put",
        url: `${folderUrl}/update/${currSelectedFolder._id}`,
        headers: {
          token,
        },
        data: {
          name: currSelectedFolder.folderName,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }

    folder.name = currSelectedFolder.folderName;
    setFolders([...folders]);
    setClosePop(false);
  };

  const handleSubFolderChangeName = async () => {
    if (currSelectedFolder.folderName.trim().length === 0) {
      return alert("all fields required");
    }

    let [folder] = folders.filter((folder) => {
      return folder.folderid === currSelectedFolder._id;
    });

    const parentID =
      historyBreadCrumbArr[historyBreadCrumbArr.length - 1].folderid;
    const folderID = currSelectedFolder._id;

    try {
      let res = await axios({
        method: "put",
        url: `${folderUrl}/update/sub/${parentID}/${folderID}`,
        headers: {
          token,
        },
        data: {
          name: currSelectedFolder.folderName,
        },
      });
      console.log(res.data);

      folder.name = currSelectedFolder.folderName;
      setFolders([...folders]);
      setClosePop(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateNewFolder = async (e) => {
    try {
      if (newFolderName.trim().length === 0) {
        return alert("all fields required");
      }

      let res = await axios({
        method: "post",
        url: `${folderUrl}/create`,
        data: {
          name: newFolderName,
        },
        headers: {
          token,
        },
      });

      res = res.data;
      console.log(res);
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

      folders.push({
        folderid: res.folder._id,
        name: res.folder.name,
      });
      setFolders([...folders]);
      setClosePop(false);
    } catch (error) {
      setClosePop(false);

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

  const handleToAddNeSubFolder = async () => {
    console.log(historyBreadCrumbArr[historyBreadCrumbArr.length - 1]);
    const folderID =
      historyBreadCrumbArr[historyBreadCrumbArr.length - 1].folderid;
    console.log(folderID);

    try {
      if (newFolderName.trim().length === 0) {
        return alert("all fields required");
      }

      let res = await axios({
        method: "post",
        url: `${folderUrl}/create/${folderID}`,
        data: {
          name: newFolderName,
        },
        headers: {
          token,
        },
      });

      res = res.data;
      console.log(res);
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

      folders.push({
        folderid: res.subFolder._id,
        name: res.subFolder.name,
      });
      setFolders([...folders]);
      console.log(folders);
      setClosePop(false);
    } catch (error) {
      setClosePop(false);
      console.log(error);
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

  const handleToAddNewFile = () => {};

  return (
    <>
      <Navbar
        folders={folders}
        setIsAddFolder={setIsAddFolder}
        setClosePop={setClosePop}
        setNewFolderName={setNewFolderName}
        handleToAddNewFile={handleToAddNewFile}
        fileArr={fileArr}
        setFilesArr={setFilesArr}
      />
      <BreadCrumb
        folders={folders}
        setFolders={setFolders}
        setFilesArr={setFilesArr}
      />
      <div
        className={Style.folder_container}
        style={
          folders.length === 0 && fileArr.length === 0
            ? {
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: "40px",
              }
            : {}
        }
      >
        {folders.length === 0 && fileArr.length === 0
          ? "Nothing to show here..."
          : folders.map((folder, index) => {
              return (
                <Folder
                  key={index}
                  folder={folder}
                  setIsAddFolder={setIsAddFolder}
                  setCurrSelectedFolder={setCurrSelectedFolder}
                  setClosePop={setClosePop}
                  folders={folders}
                  setFolders={setFolders}
                  setFilesArr={setFilesArr}
                  fileArr={fileArr}
                />
              );
            })}

        {closePop ? (
          <Pop
            isAddFolder={isAddFolder}
            handleCreateNewFolder={handleCreateNewFolder}
            handleSubFolderChangeName={handleSubFolderChangeName}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            handleClosePop={handleClosePop}
            handleFolderChangeName={handleFolderChangeName}
            currSelectedFolder={currSelectedFolder}
            setCurrSelectedFolder={setCurrSelectedFolder}
            handleToAddNeSubFolder={handleToAddNeSubFolder}
          />
        ) : (
          ""
        )}

        {
          <>
            {fileArr.map((file, index) => {
              return (
                <Photo
                  key={index}
                  file={file}
                  fileArr={fileArr}
                  setFilesArr={setFilesArr}
                />
              );
            })}
          </>
        }
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

export default Home;
