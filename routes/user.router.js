import express from "express";
import * as userController from "../controllers/user.controller.js";
import { checkAdminRole, checkUserRole } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/", userController.fetchUsers);
userRouter.get("/:id", userController.getOne);
userRouter.post("/sign-up", userController.signup);
userRouter.post("/login", userController.login);
userRouter.post("/transaction", checkUserRole, userController.transaction);
userRouter.delete("/delete", checkAdminRole, userController.deleteUser);
userRouter.post("/register-fund", checkUserRole, userController.registerFund);

export { userRouter };
