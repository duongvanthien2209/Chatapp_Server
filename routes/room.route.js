const express = require('express');

const router = express.Router();

// Controllers
const roomController = require('../controllers/room.controller');

router.get('/search', roomController.getRoomsByName);

router.get('/:userId', roomController.getRoomsByUserId);

router.post('/:userId', roomController.postCreate);

module.exports = router;
