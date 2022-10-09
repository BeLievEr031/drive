import React from "react";
import { useContext } from "react";
import { DataContext } from "../../context/DataProvider";
import Style from "./Pop.module.css";
function Pop({
  isAddFolder,
  handleSubFolderChangeName,
  handleCreateNewFolder,
  newFolderName,
  setNewFolderName,
  handleFolderChangeName,
  currSelectedFolder,
  handleClosePop,
  setCurrSelectedFolder,
  handleToAddNeSubFolder,
}) {
  const { token, historyBreadCrumbArr } = useContext(DataContext);

  return (
    <>
      <div className={Style.pop_wrapper}>
        <div className={Style.pop_data}>
          <div className={Style.input_cont}>
            <input
              type="text"
              name="folderName"
              onChange={(e) => {
                isAddFolder
                  ? setNewFolderName(e.target.value)
                  : setCurrSelectedFolder({
                      ...currSelectedFolder,
                      [e.target.name]: e.target.value,
                    });
              }}
              value={
                isAddFolder ? newFolderName : currSelectedFolder.folderName
              }
            />
          </div>

          <div className={Style.action_btn}>
            <button onClick={handleClosePop}>cancle</button>
            <button
              onClick={
                isAddFolder
                  ? historyBreadCrumbArr[historyBreadCrumbArr.length - 1]
                      .folderid == "92ecc5cd5d254b2782a58ab60023e207"
                    ? handleCreateNewFolder
                    : handleToAddNeSubFolder
                  : historyBreadCrumbArr[historyBreadCrumbArr.length - 1]
                      .folderid == "92ecc5cd5d254b2782a58ab60023e207"
                  ? handleFolderChangeName
                  : handleSubFolderChangeName
              }
            >
              {isAddFolder ? "create" : "change"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pop;
