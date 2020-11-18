/* eslint-disable no-console */
const Room = require('../models/Room.model');

const Response = require('../helpers/response.helper');

module.exports.getRoomsByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      throw new Error('Có lỗi xảy ra');
    }

    const rooms = await Room.find({ members: userId });

    return Response.success(res, { rooms });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

module.exports.getRoomsByName = async (req, res) => {
  const { q } = req.query;

  try {
    if (!q) {
      throw new Error('Có lỗi xảy ra');
    }

    let rooms = await Room.find();
    rooms = rooms.filter(
      (item) => item.name.toLowerCase().indexOf(q.toLowerCase()) !== -1,
    );

    return Response.success(res, { rooms });
  } catch (error) {
    console.error(error);
    return Response.error(res, error);
  }
};

module.exports.postCreate = async (req, res, next) => {
  const { name } = req.body;
  const { userId } = req.params;

  try {
    if (!name || !userId) {
      throw new Error('Có lỗi xảy ra');
    }

    const currentRoom = await Room.findOne({ name });

    if (currentRoom) {
      throw new Error('Tên phòng không được trùng');
    }

    const room = new Room({ name, members: [userId] });
    await room.save();

    return Response.success(res, { room, message: 'Tạo phòng thành công!' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
