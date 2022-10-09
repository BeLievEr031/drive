import axios from "axios";
import React from "react";
import { useContext } from "react";
import { DataContext } from "../../context/DataProvider";
import Style from "./BreadCrumb.module.css";

function BreadCrumb({ folders, setFolders, setFilesArr }) {
  const {
    breadCrumbArr,
    setBreadCrumbArr,
    historyBreadCrumbArr,
    setHistoryBreadCrumbArr,
    folderUrl,
    fileUrl,
    token,
  } = useContext(DataContext);

  const handleBreadCrumbAndApiReq = async (e) => {
    let idx = historyBreadCrumbArr.findIndex(
      (i) => i.folderid === e.target.getAttribute("value")
    );

    historyBreadCrumbArr.splice(idx + 1);
    console.log(historyBreadCrumbArr);
    setHistoryBreadCrumbArr([...historyBreadCrumbArr]);

    try {
      if (
        e.target.getAttribute("value") === "92ecc5cd5d254b2782a58ab60023e207"
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
          setFolders([...res.folders]);
        } catch (error) {
          console.log(error.data);
        }

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
        } catch (error) {
          console.log(error.data);
        }
      } else {
        console.log(e.target.getAttribute("value"));
        let res = await axios({
          method: "get",
          url: `${folderUrl}/get/sub/${e.target.getAttribute("value")}`,
          headers: {
            token,
          },
        });

        const subFolders = res.data.sub_folders;
        console.log(subFolders);
        setFolders([...subFolders]);

        try {
          let res = await axios({
            method: "get",
            url: `${fileUrl}/get/sub/${e.target.getAttribute("value")}`,
            headers: {
              token,
            },
          });

          const subFiles = res.data.subFiles;
          setFilesArr([...subFiles]);
        } catch (error) {
          console.log(error.data);
        }
      }
    } catch (error) {
      console.log(error.data);
    }
  };

  return (
    <>
      <nav className={Style.nav}>
        {historyBreadCrumbArr.map((bread, index) => {
          return (
            <span
              key={index}
              onClick={(e) => handleBreadCrumbAndApiReq(e)}
              value={bread.folderid}
              style={{
                cursor: "pointer",
                color: "blue",
                userSelect: "none",
              }}
            >
              {bread.name + "/"}
            </span>
          );
        })}
      </nav>
    </>
  );
}

export default BreadCrumb;
