import { errorResponse, successResponse } from "../middleware/responser.js";
import { FundModel } from "../models/fund.model.js";

const fetchFund = async (req, res, next) => {
  try {
    let query = FundModel.find();

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * pageSize;
    const total = await FundModel.countDocuments();
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

const createFund = async (req, res) => {
  try {
    const {
      name,
      fundManager,
      trusteeFund,
      auditor,
      investManagers,
      activityStartDate,
      fundType,
    } = req.body;
    const newFund = new FundModel({
      name,
      fundManager,
      trusteeFund,
      auditor,
      investManagers,
      activityStartDate,
      fundType,
    });
    const response = await newFund.save();
    return successResponse(res, response);
  } catch (error) {
    return errorResponse(res, error);
  }
};

const editFund = async (req, res) => {
  try {
    const {
      fundId,
      name,
      fundManager,
      trusteeFund,
      auditor,
      investManagers,
      activityStartDate,
    } = req.body;
    const obj = {
      name,
      fundManager,
      trusteeFund,
      auditor,
      investManagers,
      activityStartDate,
    };

    if (!fundId) {
      throw new Error("No fund Id is available ");
    }
    if (!(await FundModel.findById(fundId))) {
      throw new Error("fund Id is not available ");
    }

    const newObject = Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value)
    );

    if (Object.keys(newObject).length === 0) {
      throw new Error("No valid new key was sent ");
    }

    const response = await FundModel.findByIdAndUpdate(fundId, newObject, {
      new: true,
      runValidators: true,
    });

    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteFund = async (req, res, next) => {
  const { fundId } = req.body;
  try {
    await FundModel.deleteOne({ _id: fundId });
    successResponse(res, "deleted");
  } catch (error) {
    errorResponse(res, error);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await FundModel.findById(id);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

export { fetchFund, createFund, editFund, deleteFund, getOne };
