import FileModel from "../models/FileModel.js";
import tryCatchHandler from "../middleware/tryCatchHandler.js";
import cloudinaryUpload from "../middleware/uploadFile.js";
import ErrorHandler from "../utils/error.js";
import FolderModel from "../models/FolderModel.js";
import UserModel from "../models/UserModel.js";
// upload new file
const uploadFile = tryCatchHandler(async (req, res, next) => {
  const user = req.user;
  // console.log(req.body);
  const [filteredFile] = user.files.filter((file) => {
    return JSON.parse(JSON.stringify(file.file_name)) === req.file.originalname;
  });

  if (filteredFile) {
    return next(new ErrorHandler(401, "File already exists.."));
  }

  let result = await cloudinaryUpload.uploader.upload(req.file.path);

  const fileData = {
    public_id: result.public_id,
    file_url: result.secure_url,
    file_name: req.file.originalname,
    size: +req.file.size,
  };

  user.files.push(fileData);

  await user.save();
  res.json({
    msg: "file uploaded",
    result,
    user,
  });
});

const uploadSubFile = tryCatchHandler(async (req, res, next) => {
  const user = req.user;

  const { parentID } = req.params;

  let folder = await FolderModel.findById(parentID);
  let result = await cloudinaryUpload.uploader.upload(req.file.path);

  const fileData = {
    public_id: result.public_id,
    file_url: result.secure_url,
    file_name: req.file.originalname,
    size: +req.file.size,
  };

  folder.subFiles.push(fileData);
  await folder.save();

  res.status(200).json({
    success: true,
    msg: "file uploaded",
    folder,
  });
});

// get existing file
const getFiles = tryCatchHandler(async (req, res, next) => {
  // console.log(req.user);
  const user = await UserModel.findById(req.user._id).populate("files");
  const files = user.files;

  res.json({
    success: true,
    msg: "All files are fetched...",
    files,
  });
});

const getSubFiles = tryCatchHandler(async (req, res, next) => {
  const { parentID } = req.params;

  // console.log("i am a", parentID);

  const folder = await FolderModel.findById(parentID).populate("subFiles");
  const subFiles = folder.subFiles;

  res.json({
    success: true,
    msg: "All subFiles are fetched...",
    subFiles,
  });
});

const deleteSubFile = tryCatchHandler(async (req, res, next) => {
  const user = req.user;
  // console.log(user);
  const { parentID, fileID } = req.params;
  let folder = await FolderModel.findById(parentID);
  let result = await cloudinaryUpload.uploader.destroy(fileID);

  let idx = folder.subFiles.findIndex((cFile) => {
    return cFile.public_id === fileID;
  });

  if(idx === -1){
    return next(new ErrorHandler(404,"file not found"))
  }
  
  folder.subFiles.splice(idx, 1);
  await folder.save();
  res.status(200).json({
    success: true,
    msg: "file deleted..",
  });
});
const deleteFile = tryCatchHandler(async (req, res, next) => {
  const user = req.user;
  // console.log(user);
  const { fileID } = req.params;
  let result = await cloudinaryUpload.uploader.destroy(fileID);

  let idx = user.files.findIndex((cFile) => {
    return cFile.public_id === fileID;
  });

  
  if(idx === -1){
    return next(new ErrorHandler(404,"file not found"))
  }

  user.files.splice(idx, 1);
  await user.save();
  res.status(200).json({
    success: true,
    msg: "file deleted..",
  });
});

export {
  uploadFile,
  uploadSubFile,
  deleteFile,
  getFiles,
  getSubFiles,
  deleteSubFile,
};
