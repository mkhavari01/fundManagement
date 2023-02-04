import bcryptjs from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../middleware/responser.js";
import { TransactionModel } from "../models/transaction.model.js";
import { FundModel } from "../models/fund.model.js";
import { InvestModel } from "../models/invest.model.js";

const signup = async (req, res, next) => {
  try {
    const { name, password, role = "user" } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = new UserModel({
      name,
      password: hashedPassword,
      role,
    });

    const response = await newUser.save();
    const token = jwt.sign(
      { role, _id: response._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    successResponse(res, { name, token });
  } catch (error) {
    errorResponse(res, error);
  }
};

const login = async (req, res, next) => {
  try {
    const { name, password, role = "user" } = req.body;

    const validUser = await UserModel.findOne({ name });
    if (!validUser) {
      throw new Error("User is not valid.");
    }

    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) {
      throw new Error("Password is not valid.");
    }

    const token = jwt.sign(
      { role, _id: validUser._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    successResponse(res, { user: validUser, token });
  } catch (error) {
    errorResponse(res, error);
  }
};

const transaction = async (req, res, next) => {
  let log, userUpdate;
  try {
    const { fundId, units, action } = req.body;
    // res.json(req.user);

    const { _id, funds } = req.user;

    let filterArr = funds.filter((el) => el.fundId == fundId);

    log = {
      investUpdate: false,
      userUpdate: false,
      action: action,
      quantity: units,
      user: _id,
      fund: fundId,
      success: false,
      failIn: "none",
    };

    if (!filterArr.length) {
      throw new Error("you havent registred for this fund");
    }

    const fund = await FundModel.findById(fundId).populate("invest");

    if (!fund) {
      throw new Error("We dont have such a fund");
    }

    if (!action) {
      throw new Error("pls set an action 'buy' or 'sell'");
    }

    if (action === "sell") {
      await InvestModel.findByIdAndUpdate(
        fund.invest._id,
        { $inc: { remainedUnits: +units } },
        { new: true, runValidators: true }
      );

      log.investUpdate = true;

      userUpdate = await UserModel.updateOne(
        { _id: _id, "funds.fundId": fundId },
        {
          $inc: { "funds.$.totalUnits": -units },
        }
      );
    } else if (action === "buy") {
      await InvestModel.findByIdAndUpdate(
        fund.invest._id,
        { $inc: { remainedUnits: -units } },
        { new: true, runValidators: true }
      );

      log.investUpdate = true;

      userUpdate = await UserModel.updateOne(
        { _id: _id, "funds.fundId": fundId },
        {
          $inc: { "funds.$.totalUnits": +units },
        }
      );
    }

    log.userUpdate = true;
    log.success = true;

    return successResponse(res, userUpdate);
  } catch (error) {
    errorResponse(res, error);
  } finally {
    let rr = new TransactionModel(log);
    await rr.save();
  }
};

const registerFund = async (req, res) => {
  try {
    const { fundId } = req.body;
    const { _id, funds } = req.user;

    const checkArr = funds.filter((el) => el.fundId === fundId);

    if (!checkArr.length) {
      throw new Error("this fund already exist");
    }

    const response = await UserModel.updateOne(
      { _id },
      { $push: { funds: { fundId, totalUnits: 0 } } }
    );

    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteUser = async (req, res, next) => {
  console.log("here");
  const { userId } = req.body;
  try {
    await UserModel.deleteOne({ _id: userId });
    successResponse(res, "deleted");
  } catch (error) {
    errorResponse(res, error);
  }
};

const fetchUsers = async (req, res, next) => {
  try {
    let query = UserModel.find();

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * pageSize;
    const total = await UserModel.countDocuments();
    const pages = Math.ceil(total / pageSize);
    query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 });

    if (page > pages) {
      throw new Error("No page found");
    }
    const result = await query;
    const response = {
      count: total,
      page,
      pages,
      result,
    };
    return successResponse(res, response);
  } catch (error) {
    return errorResponse(res, error);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await UserModel.findById(id);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

export {
  signup,
  login,
  registerFund,
  transaction,
  deleteUser,
  fetchUsers,
  getOne,
};
