const express = require('express');

const router = express.Router();

// Controllers
const messageController = require('../controllers/message.controller');

router.get('/:roomId', messageController.getMessagesByRoomId);

module.exports = router;
