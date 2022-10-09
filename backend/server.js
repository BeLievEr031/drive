import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./db/dbConnect.js";
import userRouter from "./routes/userRoutes.js";
import fileRoute from "./routes/fileRoutes.js";
import folderRoute from "./routes/folderRoutes.js";
import errorHandler from "./middleware/Errorr.js";
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/file", fileRoute);
app.use("/api/v1/folder", folderRoute);

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  dbConnect();
  console.log("Connected To the Server " + PORT);
});

app.use(errorHandler);
