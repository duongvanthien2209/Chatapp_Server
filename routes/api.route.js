const express = require('express');

const router = express.Router();

// HandleErrors
const handleError = require('../helpers/handleError.helper');

// Middlewares
const authMiddleware = require('../middlewares/auth.middleware');

// Routes
const authRoute = require('./auth.route');
const roomRoute = require('./room.route');
const messageRoute = require('./message.route');

router.use('/auth', authRoute);

// router.use(handleError);

router.use(authMiddleware.checkToken);

router.use('/rooms', roomRoute);

// router.use(handleError);

router.use('/messages', messageRoute);

router.use(handleError);

module.exports = router;
