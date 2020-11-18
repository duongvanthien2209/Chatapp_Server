/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const socketio = require('socket.io');
const mongoose = require('mongoose');

// Models
const User = require('../models/User.model');
const Room = require('../models/Room.model');
const Message = require('../models/Message.model');

function handleSocketIo(server) {
  const io = socketio(server);

  io.on('connection', (socket) => {
    // eslint-disable-next-line no-console
    console.log('Has connection');

    socket.on('join', async ({ roomId, userId }, callback) => {
      // 1. Kiểm tra xem roomId, userId có tồn tại
      // 2. Thêm user vào room
      try {
        const user = await User.findById(userId);
        const room = await Room.findByIdAndUpdate(roomId, {
          $addToSet: { members: user._id },
        });

        if (!user || !room) {
          throw new Error('Có lỗi xảy ra');
        }

        // Giởi tin nhắn từ server về cho chính người đó
        socket.emit('message', {
          userId: { name: 'admin' },
          text: `${user.name}, welcome to the room ${room.name}`,
          dateCreate: new Date(),
        });
        // Gởi tin nhắn cho tất cả người còn lại trong chung phòng đó
        socket.broadcast.to(room.id.toString()).emit('message', {
          userId: { name: 'admin' },
          text: `${user.name}, has joined!`,
          dateCreate: new Date(),
        });

        socket.join(room.id.toString());

        return callback();
      } catch (error) {
        console.error(error);
        return callback(error);
      }
    });

    socket.on('sendMessage', async ({ userId, roomId, text }, callback) => {
      // 1. Tạo message mới
      try {
        const now = new Date();
        let message = new Message({
          userId: mongoose.Types.ObjectId(userId),
          roomId: mongoose.Types.ObjectId(roomId),
          text,
          dateCreate: now,
        });
        await message.save();

        message = await Message.findById(message._id).populate('userId');

        // Sơ chế lại dữ liệu
        message = {
          text: message.text,
          dateCreate: message.dateCreate,
          userId: {
            _id: message.userId._id,
            name: message.userId.name,
            avatar: message.userId.avatar,
          },
        };

        io.to(roomId).emit('message', message);

        return callback();
      } catch (error) {
        console.error(error);
        return callback(error);
      }
    });

    socket.on('disconnect', async ({ roomId, userName }) => {
      // eslint-disable-next-line no-console
      console.log('User has left');

      // Giởi tin nhắn từ server cho tất cả các user trong phòng
      io.to(roomId).emit('message', {
        userId: { name: 'admin' },
        text: `${userName} has left.`,
      });
    });
  });
}

module.exports = handleSocketIo;
