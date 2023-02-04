import express from "express";
import * as fundController from "../controllers/fund.controller.js";
import { checkAdminRole } from "../middleware/auth.js";

const fundRouter = express.Router();

fundRouter.get("/", fundController.fetchFund);
fundRouter.post("/", checkAdminRole, fundController.createFund);
fundRouter.patch("/", checkAdminRole, fundController.editFund);
fundRouter.delete("/", checkAdminRole, fundController.deleteFund);
fundRouter.get("/:id", fundController.getOne);

export { fundRouter };
