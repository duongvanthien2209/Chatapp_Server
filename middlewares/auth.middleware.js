/* eslint-disable no-console */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');

module.exports.checkToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.authorization;

  try {
    if (!token) {
      throw new Error('Không tìm thấy token');
    }

    const decode = jwt.verify(token.split(' ')[1], process.env.PRIVATE_KEY);
    const user = await User.findById(decode.id);

    if (!user) {
      throw new Error('Token không hợp lệ');
    }

    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
