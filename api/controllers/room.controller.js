const Room = require('../../models/Room.model');

const Response = require('../../helpers/response.helper');

module.exports.getRoomsByUserId = async (req, res) => {
  const { _userId } = req.params;

  try {
    if (!_userId) {
      throw new Error('Có lỗi xảy ra');
    }

    const rooms = await Room.find({ members: _userId });

    Response.success(res, { rooms });
  } catch (error) {
    Response.error(res, error);
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

    Response.success(res, { rooms });
  } catch (error) {
    Response.error(res, error);
  }
};

module.exports.postCreate = async (req, res) => {
  const { name } = req.body;
  const { _userId } = req.params;

  try {
    if (!name || !_userId) {
      throw new Error('Có lỗi xảy ra');
    }

    const room = new Room({ name, members: [_userId] });
    await room.save();

    Response.success(res, { room });
  } catch (error) {
    Response.error(res, error);
  }
};
