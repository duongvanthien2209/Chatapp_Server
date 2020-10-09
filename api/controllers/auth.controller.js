require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Cloudinary - Dùng để upload file lên cloud
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const User = require('../../models/User.model');
const Response = require('../../helpers/response.helper');

module.exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      next(new Error('Bạn nhập sai mật khẩu'));
      return;
    }

    const token = await jwt.sign({ id: user.id }, process.env.PRIVATE_KEY);
    Response.success(res, { message: 'Đăng nhập thành công', token, user });
  } catch (error) {
    next(error);
  }
};

module.exports.postRegister = async (req, res, next) => {
  const { name, email } = req.body;
  let { password } = req.body;
  const saltRounds = 10;

  try {
    password = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, password });
    await user.save();
    Response.success(res, { message: 'Tạo tài khoản thành công' });
  } catch (error) {
    next(error);
  }
};

module.exports.postUpdate = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  let { password } = req.body;
  const { file } = req;
  const saltRounds = 10;

  try {
    if (!id || !name || !email || !password || !file) {
      throw new Error('Có lỗi xảy ra');
    }

    let user = await User.findById(id);

    if (!user) {
      throw new Error('Có lỗi xảy ra');
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const avatar = result.url;
    password = password === user.password
      ? user.password
      : await bcrypt.hash(password, saltRounds);

    await User.findByIdAndUpdate(id, {
      name,
      email,
      password,
      avatar,
    });
    user = await User.findById(id);
    Response.success(res, { user });
  } catch (error) {
    Response.error(res, { message: 'Có lỗi xảy ra' });
  }
};
