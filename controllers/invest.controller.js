import { errorResponse, successResponse } from "../middleware/responser.js";
import { FundModel } from "../models/fund.model.js";
import { InvestModel } from "../models/invest.model.js";

const fetchInvests = async (req, res) => {
  try {
    let query = InvestModel.find();

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * pageSize;
    const total = await InvestModel.countDocuments();
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

const createInvest = async (req, res) => {
  let savedInvest;
  try {
    const { fundId } = req.body;

    if (!fundId) {
      throw new Error("No fundId available");
    }
    const fundData = await FundModel.findById(fundId);
    if (fundData.invest) {
      throw new Error(
        "this fund has an invest you can not set a new invest for that "
      );
    }
    const {
      investUnits,
      remainedUnits,
      issuePrice,
      cancelPrice,
      statisticPrice,
    } = req.body;

    const invest = new InvestModel({
      fund: fundId,
      investUnits,
      remainedUnits,
      issuePrice,
      cancelPrice,
      statisticPrice,
    });

    savedInvest = await invest.save();
    await FundModel.findByIdAndUpdate(fundId, {
      invest: savedInvest._id,
    });
    successResponse(res, savedInvest);
  } catch (error) {
    if (savedInvest) {
      await InvestModel.remove({ _id: savedInvest._id });
    }
    errorResponse(res, error);
  }
};

const editInvest = async (req, res) => {
  try {
    const {
      investId,
      investUnits,
      remainedUnits,
      issuePrice,
      cancelPrice,
      statisticPrice,
    } = req.body;
    const obj = {
      investUnits,
      remainedUnits,
      issuePrice,
      cancelPrice,
      statisticPrice,
    };

    if (!investId || !(await InvestModel.findById(investId))) {
      throw new Error("No investId is available ");
    }

    const newObject = Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value)
    );

    if (Object.keys(newObject).length === 0) {
      throw new Error("No valid new key was sent ");
    }

    const response = await InvestModel.findByIdAndUpdate(investId, newObject, {
      new: true,
      runValidators: true,
    });

    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteInvest = async (req, res, next) => {
  const { investId } = req.body;
  try {
    await InvestModel.deleteOne({ _id: investId });
    successResponse(res, "deleted");
  } catch (error) {
    errorResponse(res, error);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await InvestModel.findById(id);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

export { fetchInvests, createInvest, editInvest, deleteInvest, getOne };
