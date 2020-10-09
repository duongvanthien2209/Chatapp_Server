const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  members: { type: Array, default: [] },
});

const Room = mongoose.model('Room', schema, 'rooms');
module.exports = Room;
