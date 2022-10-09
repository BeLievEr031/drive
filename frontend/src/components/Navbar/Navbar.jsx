import axios from "axios";
import React from "react";
import { useState } from "react";
import { useContext } from "react";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import FilePop from "../FilePop/FilePop";
import Style from "./Navbar.module.css";
function Navbar({
  setIsAddFolder,
  setClosePop,
  setNewFolderName,
  handleToAddNewFile,
  fileArr,
  setFilesArr,
}) {
  const [isFile, setIsFile] = useState(false);
  const [logout, setLogout] = useState(false);
  const { token, user } = useContext(DataContext);
  const navigate = useNavigate();
  if (!token) {
    return;
  }
  const handleToOpenLogOut = () => {
    setLogout(true);
  };

  const handleLogout = () => {
    setLogout(false);
    window.localStorage.removeItem("token");
    navigate("/");
  };

  const handleToAddNewFolder = () => {
    setNewFolderName("");
    setIsAddFolder(true);
    setClosePop(true);
  };

  const handleToOpenFilePop = (e) => {
    setIsFile(true);
  };

  return (
    <>
      <nav className={Style.navContainer}>
        <div className={Style.icn_cont}>
          <span
            onClick={handleToAddNewFolder}
            className={`material-symbols-outlined ${Style.icn_font}`}
          >
            drive_folder_upload
          </span>
          <span
            onClick={handleToOpenFilePop}
            className={`material-symbols-outlined ${Style.icn_font}`}
          >
            note_add
          </span>
        </div>
        <Avatar
          onClick={handleToOpenLogOut}
          name={user.name}
          size="50"
          round={true}
          style={{
            cursor: "pointer",
          }}
        />
      </nav>
      {isFile ? (
        <FilePop
          setIsFile={setIsFile}
          fileArr={fileArr}
          setFilesArr={setFilesArr}
        />
      ) : (
        ""
      )}

      <div
        onClick={handleLogout}
        className={Style.logout}
        style={
          logout
            ? {
                display: "block",
              }
            : {
                display: "none",
              }
        }
      >
        logout
      </div>
    </>
  );
}

export default Navbar;
