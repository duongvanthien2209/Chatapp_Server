require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_URL);
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Helpers
const handleConnection = require('./helpers/handleConnection.helper');

// Routes
const apiRoute = require('./routes/api.route');

// Models
const User = require('./models/User.model');
const Room = require('./models/Room.model');
const Message = require('./models/Message.model');

app.use('/api', apiRoute);

app.get('/', (req,res) => res.send('All done'));

io.on('connection', socket => {
    console.log('Has connection');

    socket.on('join', async ({ roomId, userId }, callback) => {
        // console.log(name, room, callback);
        // callback({ message: 'Done' }); => Dùng để gởi thông báo lại cho client

        // 1. Kiểm tra xem roomId, userId có tồn tại
        // 2. Thêm user vào room
        try {
            let user = await User.findById(userId);
            let room = await Room.findByIdAndUpdate(roomId, { $addToSet: { members: user._id } });

            if (!user || !room) {
                throw new Error('Có lỗi xảy ra');
            }

            // Giởi tin nhắn từ server về cho chính người đó
            socket.emit('message', { user: { name: 'admin' }, text: `${user.name}, welcome to the room ${room.name}`, dateCreate: new Date() });
            // Gởi tin nhắn cho tất cả người còn lại trong chung phòng đó
            socket.broadcast.to(room._id).emit('message', { user: { name: 'admin' }, text: `${user.name}, has joined!`, dateCreate: new Date() });

            socket.emit('event', 'Done1');

            socket.join(room._id);

            // Chưa biết
            // io.to(room._id).emit('roomData', { room: room._id, users: room.members });

            callback();
        } catch (error) {
            return callback(error);
        }
    });

    socket.on('sendMessage', async ({ userId, roomId, text }, callback) => {
        // 1. Tạo message mới
        try {
            let now = new Date();
            let message = new Message({ userId, roomId, text, dateCreate: now });
            await message.save();

            let user = await User.findById(userId);
            message = { ...message._doc, user };

            io.to(roomId).emit('message', message);
            socket.emit('event', 'Done2');

            callback();
        } catch (error) {
            return callback(error);
        }
    });

    socket.on('disconnect', async ({ roomId, userName }) => {
        console.log('User has left');

        let room = await Room.findById(roomId);

        // Giởi tin nhắn từ server cho tất cả các user trong phòng
        io.to(roomId).emit('message', { user: { name: 'admin' }, text: `${userName} has left.` });
        // Chưa biết
        // io.to(roomId).emit('roomData', { room: roomId, users: room.members });
    });
});

server.listen(port, () => console.log(`Server has started on port ${port}`));