const express = require('express');
const router = express.Router();
const { register, login, logout, token } = require('../../config/auth');

// @route POST /api/auth/register
// @desc Register user route
// @access Public
router.post('/register', register);

// @route POST /api/auth/login
// @desc Login user route
// @access Public
router.post('/login', login);

// @route GET /api/auth/logout
// @desc Logout user route
// @access Public
router.get('/logout', logout);

// @route GET /api/auth/token
// @desc refresh token user route
// @access Public
router.post('/token', token);

module.exports = router;
