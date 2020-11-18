const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema({
  name: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Room = mongoose.model('Room', schema, 'rooms');
module.exports = Room;
