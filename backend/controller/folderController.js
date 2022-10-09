import FolderModel from "../models/FolderModel.js";
import tryCatchHandler from "../middleware/tryCatchHandler.js";
import ErrorHandler from "../utils/error.js";
import UserModel from "../models/UserModel.js";
import cloudinaryUpload from "../middleware/uploadFile.js";
// used to create folder
const createFolder = tryCatchHandler(async (req, res, next) => {
  let user = req.user;
  // console.log(user.folders);
  const { name } = req.body;

  if (!name) {
    return next(new ErrorHandler(406, "All Fields Required.."));
  }

  let filteredFolder = await user.folders.filter((folder) => {
    return folder.name === name;
  });

  if (filteredFolder.length >= 1) {
    return next(new ErrorHandler(401, "Folder Already Exists.."));
  }

  let folder = await new FolderModel({
    name,
  });

  await folder.save();
  user.folders.push({
    folderid: folder._id,
    name,
  });
  await user.save();

  res.status(200).json({
    success: true,
    msg: "Folder created",
    folder,
  });
});

// used to create sub-folder
const createSubFolder = tryCatchHandler(async (req, res, next) => {
  const { name } = req.body;
  const { folderID } = req.params;

  if (!name) {
    return next(new ErrorHandler(406, "All fields Required.."));
  }

  let folder = await FolderModel.findById(folderID);

  if (!folder) {
    return next(new ErrorHandler(404, "Invalid Folder.."));
  }

  // let isExists = folder.subFolders.indexOf()

  // if(){

  // }

  let subFolder = new FolderModel({
    name,
    owner_folder: folderID,
  });

  await subFolder.save();

  folder.subFolders.push({
    folderid: subFolder._id,
    name: subFolder.name,
  });
  await folder.save();

  res.status(200).json({
    success: true,
    msg: "Folder Created",
    subFolder,
  });
});

// used to delete folder
const deleteFolder = tryCatchHandler(async (req, res, next) => {
  const user = req.user;
  const { folderID } = req.params;
  let folder = await FolderModel.findById(folderID);
  if (!folder) {
    return next(new ErrorHandler(404, "folder not found..."));
  }

  let idx = user.folders.findIndex((folder) => {
    return JSON.parse(JSON.stringify(folder.folderid)) === folderID;
  });
  if (idx !== -1) {
    user.folders.splice(idx, 1);
    await user.save();
  }

  async function handleDeleteFolder(id) {
    let folder = await FolderModel.findById(id);

    folder.subFolders.forEach(async (cFolder) => {
      handleDeleteFolder(JSON.parse(JSON.stringify(cFolder.folderid)));
    });

    folder.subFiles.forEach(async (cFile) => {
      await cloudinaryUpload.uploader.destroy(
        JSON.parse(JSON.stringify(cFile.public_id))
      );
    });

    await folder.remove();
  }

  handleDeleteFolder(folderID);

  res.status(200).json({
    success: true,
    msg: "Folder deleted",
  });
});

// used to delete subFolder
const deleteSubFolder = tryCatchHandler(async (req, res, next) => {
  const { parentID, folderID } = req.params;
  let folder = await FolderModel.findById(folderID);
  let parentFolder = await FolderModel.findById(parentID);
  if (!folder) {
    return next(new ErrorHandler(404, "folder not found..."));
  }

  let idx = parentFolder.subFolders.findIndex((folder) => {
    return JSON.parse(JSON.stringify(folder.folderid)) === folderID;
  });
  if (idx !== -1) {
    parentFolder.subFolders.splice(idx, 1);
    await parentFolder.save();
  }

  async function handleDeleteFolder(id) {
    let folder = await FolderModel.findById(id);

    folder.subFolders.forEach(async (cFolder) => {
      handleDeleteFolder(JSON.parse(JSON.stringify(cFolder.folderid)));
    });

    folder.subFiles.forEach(async (cFile) => {
      await cloudinaryUpload.uploader.destroy(
        JSON.parse(JSON.stringify(cFile.public_id))
      );
    });

    await folder.remove();
  }

  handleDeleteFolder(folderID);

  res.status(200).json({
    success: true,
    msg: "Folder deleted",
  });
});

// user to get all folder
const getFolders = tryCatchHandler(async (req, res, next) => {
  let user = req.user;
  const folders = await UserModel.findById(user._id).populate("folders");

  res.status(200).json({
    success: true,
    msg: "folders fetched..",
    folders,
  });
});

// useto get single folder details like--total size and total files
const getFolderDetails = tryCatchHandler(async (req, res, next) => {
  const { folderID } = req.params;

  const folder = await FolderModel.findById(folderID);

  if (!folder) {
    return next(new ErrorHandler(404, "folder not found..."));
  }

  res.status(200).json({
    success: true,
    msg: "details fetched..",
    folder_num: folder.subFolders.length,
    file_num: folder.fileData.length,
  });
});

// used for folder name update
const updateFolder = tryCatchHandler(async (req, res, next) => {
  const user = req.user;

  const folders = user.folders;

  const { name } = req.body;
  const { folderID } = req.params;
  if (!name) {
    return next(new ErrorHandler(406, "All fields required..."));
  }

  let folder = await FolderModel.findById(folderID);

  if (!folder) {
    return next(new ErrorHandler(404, "folder not found..."));
  }

  folder = await FolderModel.findByIdAndUpdate(
    {
      _id: folderID,
    },
    {
      $set: {
        name,
      },
    }
  );

  let idx = user.folders.findIndex((cufolder) => {
    return JSON.parse(JSON.stringify(cufolder.folderid)) + "" === folderID;
  });

  // console.log(idx);
  user.folders[idx].name = name;
  await user.save();

  res.status(200).json({
    success: true,
    msg: "Folder Updated....",
  });
});

const updateSubFolder = tryCatchHandler(async (req, res, next) => {
  const { name } = req.body;
  const { parentID, folderID } = req.params;

  // console.log(parentID);
  // console.log(folderID);

  if (!name) {
    return next(new ErrorHandler(406, "All fields required..."));
  }

  let parentFolder = await FolderModel.findById(parentID);
  let folder = await FolderModel.findById(folderID);

  if (!folder) {
    return next(new ErrorHandler(404, "folder not found..."));
  }

  folder = await FolderModel.findByIdAndUpdate(
    {
      _id: folderID,
    },
    {
      $set: {
        name,
      },
    }
  );

  let idx = parentFolder.subFolders.findIndex((cufolder) => {
    return JSON.parse(JSON.stringify(cufolder.folderid)) + "" === folderID;
  });

  parentFolder.subFolders[idx].name = name;
  await parentFolder.save();

  res.status(200).json({
    success: true,
    msg: "Folder Updated....",
  });
});
// get all sub-folder
const getAllSubFolder = tryCatchHandler(async (req, res, next) => {
  const { folderID } = req.params;
  // console.log(folderID);
  let folder = await FolderModel.findById(folderID).populate("subFolders");
  if (!folder) {
    return next(new ErrorHandler(404, "folder not found..."));
  }

  res.status(200).json({
    success: true,
    msg: "sub folders fetched..",
    sub_folders: folder.subFolders,
  });
});

export {
  createFolder,
  createSubFolder,
  deleteFolder,
  getFolders,
  getFolderDetails,
  updateFolder,
  getAllSubFolder,
  deleteSubFolder,
  updateSubFolder,
};
