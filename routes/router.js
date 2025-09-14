const express = require('express');
const { register, login, getProfile } = require('../Controller/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const router = express.Router();

router.post('/api/register', register);
router.post('/api/login', login);
router.get('/api/profile', jwtMiddleware, getProfile);

module.exports = router;