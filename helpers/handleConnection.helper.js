const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const User = require('../models/User.model');
const Room = require('../models/Room.model');
const Message = require('../models/Message.model');

const handleConnection = (socket) => {
  // eslint-disable-next-line no-console
  console.log('Has connection');

  socket.on('join', async ({ roomId, userId }, callback) => {
    // console.log(name, room, callback);
    // callback({ message: 'Done' }); => Dùng để gởi thông báo lại cho client

    // 1. Kiểm tra xem roomId, userId có tồn tại
    // 2. Thêm user vào room
    try {
      const user = await User.findById(userId);
      const room = await Room.findByIdAndUpdate(roomId, {
        $addToSet: { members: user.id.toString() },
      });

      if (!user || !room) {
        throw new Error('Có lỗi xảy ra');
      }

      // Giởi tin nhắn từ server về cho chính người đó
      socket.emit('message', {
        user: { name: 'admin' },
        text: `${user.name}, welcome to the room ${room.name}`,
        dateCreate: new Date(),
      });
      // Gởi tin nhắn cho tất cả người còn lại trong chung phòng đó
      socket.broadcast.to(room.id.toString()).emit('message', {
        user: { name: 'admin' },
        text: `${user.name}, has joined!`,
        dateCreate: new Date(),
      });

      socket.join(room.id.toString());

      // Chưa biết
      // io.to(room._id).emit('roomData', { room: room._id, users: room.members });

      return callback();
    } catch (error) {
      return callback(error);
    }
  });

  socket.on('sendMessage', async ({ userId, roomId, text }, callback) => {
    // 1. Tạo message mới
    try {
      const message = new Message({ userId, roomId, text });
      await message.save();

      io.to(roomId).emit('message', message);

      return callback();
    } catch (error) {
      return callback(error);
    }
  });

  socket.on('disconnect', async ({ roomId, userName }) => {
    // eslint-disable-next-line no-console
    console.log('User has left');

    // Giởi tin nhắn từ server cho tất cả các user trong phòng
    io.to(roomId).emit('message', {
      user: { name: 'admin' },
      text: `${userName} has left.`,
    });
  });
};

module.exports = handleConnection;
