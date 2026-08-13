const { StatusCodes } = require("http-status-codes");

const sendSuccess = (res, StatusCode, message, data = null) => {
    return res.status(StatusCode).json({
        status: "success",
        message,
        data,
    });
};

const sendError = (res, StatusCode, message) => {
    return res.status(StatusCode).json({
        status: "error",
        message,
    });
};

module.exports = { sendSuccess, sendError };