import jwt from "jsonwebtoken";
import { errorResponse } from "./responser.js";
import { UserModel } from "../models/user.model.js";

const checkUserRole = async (req, res, next) => {
  try {
    const token = req.headers.token;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded) {
      const user = await UserModel.findById(decoded._id);
      if (!user) {
        throw new Error("Token is invalid");
      }
      req.user = user;
      next();
    } else {
      throw new Error("you are not logged in");
    }
  } catch (error) {
    errorResponse(res, error);
  }
};

const checkAdminRole = async (req, res, next) => {
  try {
    const token = req.headers.token;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    if (decoded.role === "admin") {
      const admin = await UserModel.findById(decoded._id);
      if (!admin) {
        throw new Error("Token is invalid");
      }
      req.user = admin;
      next();
    } else {
      throw new Error("you are not an admin to perform this action");
    }
  } catch (error) {
    errorResponse(res, error);
  }
};

export { checkUserRole, checkAdminRole };
