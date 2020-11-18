const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema({
  text: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
  dateCreate: Date,
});

const Message = mongoose.model('Message', schema, 'messages');
module.exports = Message;
