const express = require('express');
const router = express.Router();

// HandleErrors
const handleError = require('../helpers/handleError.helper');

// Middlewares
const authMiddleware = require('../middlewares/auth.middleware');

// Routes
const authRoute = require('../api/routes/auth.route');
const roomRoute = require('../api/routes/room.route');
const messageRoute = require('../api/routes/message.route');

router.use('/auth', authRoute);

router.use(authMiddleware.checkToken);

router.use('/rooms', roomRoute);

router.use(handleError);

router.use('/messages', messageRoute);

router.use(handleError);

module.exports = router;