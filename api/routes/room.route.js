const express = require('express');

const router = express.Router();

// Controllers
const roomController = require('../controllers/room.controller');

router.get('/search', roomController.getRoomsByName);

router.get('/:_userId', roomController.getRoomsByUserId);

router.post('/:_userId', roomController.postCreate);

module.exports = router;
