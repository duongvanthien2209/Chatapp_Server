const express = require('express');

const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });

// Controllers
const authController = require('../controllers/auth.controller');

router.route('/check').post(authController.checkToken);

router.route('/login').post(authController.postLogin);

router.route('/register').post(authController.postRegister);

router.post('/update/:id', upload.single('avatar'), authController.postUpdate);

module.exports = router;
