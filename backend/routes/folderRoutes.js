import express from "express";
import {
  createFolder,
  createSubFolder,
  getFolders,
  getFolderDetails,
  updateFolder,
  deleteFolder,
  getAllSubFolder,
  updateSubFolder,
  deleteSubFolder
} from "../controller/folderController.js";
import auth from "../middleware/auth.js";

const folderRoute = express.Router();

// used to create folder
folderRoute.post("/create", auth, createFolder);

// used to create sub-folder
folderRoute.post("/create/:folderID", auth, createSubFolder);

// Get the Folders
folderRoute.get("/get", auth, getFolders);

// To get single folder detail
folderRoute.get("/get/:folderID", auth, getFolderDetails);

// To get all sub folder detail
folderRoute.get("/get/sub/:folderID", auth, getAllSubFolder);

// used for folder name update
folderRoute.put("/update/:folderID", auth, updateFolder);

// used for sub folder name update
folderRoute.put("/update/sub/:parentID/:folderID", auth, updateSubFolder);

// used to delete folder

folderRoute.delete("/delete/:folderID", auth, deleteFolder);
// used to delete subFolder
folderRoute.delete("/delete/:parentID/:folderID", auth, deleteSubFolder);
export default folderRoute;
