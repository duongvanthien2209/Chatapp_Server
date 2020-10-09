const mongoose = require('mongoose');

const schema = mongoose.Schema({
  text: String,
  userId: String,
  roomId: String,
  dateCreate: Date,
});

const Message = mongoose.model('Message', schema, 'messages');
module.exports = Message;
