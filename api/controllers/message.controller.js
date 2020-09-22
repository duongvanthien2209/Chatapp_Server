const Message = require('../../models/Message.model');
const User = require('../../models/User.model');
const Response = require('../../helpers/response.helper');

module.exports.getMessagesByRoomId = async (req, res) => {
    let { roomId } = req.params;

    try {
        if (!roomId) {
            throw new Error('Có lỗi xảy ra');
            return;
        }

        let messages = await Message.find({ roomId });
        messages = await Promise.all(messages.map(async item => {
            let user = await User.findById(item.userId);

            return { ...item._doc, user };
        }));

        messages.sort((a, b) => a.dateCreate.getTime() - b.dateCreate.getTime());

        Response.success(res, { messages });
    } catch (error) {
        Response.error(res, error);
    }
}