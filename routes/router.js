const express = require('express');
const { register, login, getProfile } = require('../Controller/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/api/profile', jwtMiddleware, getProfile);

module.exports = router;