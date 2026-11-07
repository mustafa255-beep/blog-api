const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "غير مصرح، من غير Token",
    });
  }
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token غير صالح",
    });
  }
};
module.exports = authMiddleware;
