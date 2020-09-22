require('dotenv').config();
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');
const handleError = require('../helpers/handleError.helper');

module.exports.checkToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.authorization;

    try {
        if (!token) {
            throw new Error('Không tìm thấy token');
            return;
        }

        let decode = jwt.verify(token.split(' ')[1], process.env.PRIVATE_KEY);
        let user = await User.findById(decode.id);

        if (!user) {
            throw new Error('Token không hợp lệ');
            return;
        }

        res.locals.user = user;
        next();
    } catch (error) {
        next(error);
    }
}