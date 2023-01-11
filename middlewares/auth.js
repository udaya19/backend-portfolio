const jwt = require("jsonwebtoken");

const User = require("../model/user");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.json(400, {
        message: "please login to perform this action",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
