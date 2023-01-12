const jwt = require("jsonwebtoken");
const { unAuthorizedError } = require("../apiResponse/response");

const User = require("../model/user");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res
        .status(401)
        .json(unAuthorizedError("Please login to perform this action", false));
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
};
