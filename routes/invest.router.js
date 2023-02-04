import express from "express";
import * as investController from "../controllers/invest.controller.js";
import { checkAdminRole } from "../middleware/auth.js";

const investRouter = express.Router();

investRouter.get("/", investController.fetchInvests);
investRouter.get("/:id", investController.getOne);
investRouter.post("/", checkAdminRole, investController.createInvest);
investRouter.patch("/", checkAdminRole, investController.editInvest);
investRouter.delete("/", checkAdminRole, investController.deleteInvest);

export { investRouter };
