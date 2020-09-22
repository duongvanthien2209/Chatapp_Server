const Room = require('../../models/Room.model');

const Response = require('../../helpers/response.helper');
const handleError = require('../../helpers/handleError.helper');

module.exports.getRoomsByUserId = async (req, res) => {
    let { _userId } = req.params;

    try {
        if (!_userId) {
            throw new Error('Có lỗi xảy ra');
            return;
        }

        let rooms = await Room.find({ members: _userId });

        Response.success(res, { rooms });
    } catch (error) {
        Response.error(res, error);
    }
}

module.exports.getRoomsByName = async (req,res) => {
    let { q } = req.query;

    try {
        if(!q) {
            throw new Error('Có lỗi xảy ra');
            return;
        }

        let rooms = await Room.find();
        rooms = rooms.filter(item => item.name.toLowerCase().indexOf(q.toLowerCase()) !== -1);

        Response.success(res, { rooms });
    } catch (error) {
        Response.error(res, error);
    }
}

module.exports.postCreate = async (req, res) => {
    let { name } = req.body;
    let { _userId } = req.params;

    try {
        if(!name || !_userId) {
            throw new Error('Có lỗi xảy ra');
        }

        let room = new Room({ name, members: [_userId] });
        await room.save();

        Response.success(res, { room });
    } catch (error) {
        Response.error(res, error);
    }
}