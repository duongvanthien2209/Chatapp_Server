require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const cloudinary = require('../configs/cloudinaryConfig');

const User = require('../models/User.model');
const Response = require('../helpers/response.helper');

module.exports.checkToken = async (req, res, next) => {
  const { token } = req.body;

  try {
    if (!token) {
      throw new Error();
    }

    const decode = jwt.verify(token, process.env.PRIVATE_KEY);
    const user = await User.findById(decode.id);

    if (!user) {
      throw new Error();
    }

    return Response.success(res, { message: 'Token hợp lệ', user });
  } catch (error) {
    return next(new Error('Có lỗi xảy ra'));
  }
};

module.exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Email không tồn tại');
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      throw new Error('Bạn nhập sai mật khẩu');
    }

    const token = await jwt.sign({ id: user.id }, process.env.PRIVATE_KEY);
    return Response.success(res, { message: 'Đăng nhập thành công', token, user });
  } catch (error) {
    return next(error);
  }
};

module.exports.postRegister = async (req, res, next) => {
  const { name, email } = req.body;
  let { password } = req.body;
  const saltRounds = 10;

  try {
    const currentUser = await User.findOne({ email });

    if (currentUser) {
      throw new Error('Email đã tồn tại');
    }

    password = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, password });
    await user.save();
    return Response.success(res, { message: 'Tạo tài khoản thành công' });
  } catch (error) {
    return next(error);
  }
};

module.exports.postUpdate = async (req, res, next) => {
  let { password } = req.body;
  const {
    file,
    params: { id },
    body: { name, email },
  } = req;
  const saltRounds = 10;

  try {
    if (!id || !name || !email) {
      throw new Error('Có lỗi xảy ra');
    }

    let user = await User.findById(id);

    if (!user) {
      throw new Error('User không tồn tại');
    }

    let { avatar } = user;
    if (file) {
      let orgName = file.originalname || '';
      orgName = orgName.trim().replace(/ /g, '-');
      const fullPathInServ = file.path;
      const newFullPath = `${fullPathInServ}-${orgName}`;
      fs.renameSync(fullPathInServ, newFullPath);

      const result = await cloudinary.uploader.upload(newFullPath);
      avatar = result.url;
    }

    if (password) {
      password = await bcrypt.hash(password, saltRounds);

      await User.findByIdAndUpdate(id, {
        name,
        email,
        password,
        avatar,
      });
    } else {
      await User.findByIdAndUpdate(id, {
        name,
        email,
        avatar,
      });
    }

    user = await User.findById(id);
    return Response.success(res, { user, message: 'Bạn đã cập nhật thành công!' });
  } catch (error) {
    return next(error);
  }
};
