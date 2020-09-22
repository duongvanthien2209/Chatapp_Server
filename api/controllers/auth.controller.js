require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/User.model');
const Response = require('../../helpers/response.helper');

module.exports.postLogin = async (req, res, next) => {
    let { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        let result = await bcrypt.compare(password, user.password);
        if (!result) {
            next(new Error('Bạn nhập sai mật khẩu'));
            return;
        }

        let token = await jwt.sign({ id: user.id }, process.env.PRIVATE_KEY);
        Response.success(res, { message: 'Đăng nhập thành công', token, user });
    } catch (error) {
        next(error);
    }
}

module.exports.postRegister = async (req, res, next) => {
    let { name, email, password } = req.body;
    let saltRounds = 10;

    try {
        password = await bcrypt.hash(password, saltRounds);

        let user = new User({ name, email, password });
        await user.save();
        Response.success(res, { message: 'Tạo tài khoản thành công' });
    } catch (error) {
        next(error);
    }
}

module.exports.postUpdate = async (req, res) => {
    let { id } = req.params;
    let { name, email, password } = req.body;
    let file = req.file;
    let saltRounds = 10;

    try {
        if(!id || !name || !email || !password || !file) {
            throw new Error('Có lỗi xảy ra');
            return;
        }

        let user = await User.findById(id);

        if(!user) {
            throw new Error('Có lỗi xảy ra');
            return;
        }

        let avatar = file.path.split('\\').slice(1).join('/');
        password = password === user.password ? user.password : await bcrypt.hash(password, saltRounds);

        await User.findByIdAndUpdate(id, { name, email, password, avatar });
        user = await User.findById(id);
        Response.success(res, { user });
    } catch (error) {
        Response.error(res, { message: 'Có lỗi xảy ra' });
    }
}