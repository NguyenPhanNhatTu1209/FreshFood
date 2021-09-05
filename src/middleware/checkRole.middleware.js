const jwt = require('jsonwebtoken')
const USER = require('../models/User.model');
const checkRole = (roles = [])=> async (req, res, next) => {
  const { decodeToken } = req.value.body;
  const userId = decodeToken.data.id;
  console.log(userId);
  const user = await USER.findById(userId);
  console.log(user);
  if(user&&roles.includes(user.role))
  {
    next();
    return;
  }
  res.status(401).json({
    message: 'Verify Role Failed',
    success: false
  });
};
module.exports = {
  checkRole,
}