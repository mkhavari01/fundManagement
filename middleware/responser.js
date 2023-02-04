const successResponse = (res, data) => {
  return res.status(201).json({
    status: "success",
    data,
  });
};

const errorResponse = (res, err) => {
  console.log("ERR :", err);
  return res.status(500).json({
    status: "error",
    data: err.message,
  });
};

export { successResponse, errorResponse };
