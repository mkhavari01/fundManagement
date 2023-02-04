import express, { urlencoded } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { connect } from "mongoose";
import { fundRouter } from "./routes/fund.router.js";
import { userRouter } from "./routes/user.router.js";
import { investRouter } from "./routes/invest.router.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/fund-management";

// log all api calls in system
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// public views
app.set("views", path.join(__dirname, "views"), "views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
// uploading route
app.use("/uploads", express.static("uploads"));
app.use("/api/fund", fundRouter);
app.use("/api/user", userRouter);
app.use("/api/invest", investRouter);

connect(uri)
  .then(() => {
    app.listen(port, () => console.log(`server is listening on port ${port}`));
  })
  .catch((err) => {
    console.log("we have an error in connceting to db", err);
  });
