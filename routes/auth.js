const express = require('express');

const authController = require('../controllers/admin/auth');
const authMiddleware = require('../middleware/is-auth')

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/admin/user-signup', authMiddleware.isAdmin, authController.getUserSignup);

router.post('/admin/user-signup', authMiddleware.isAdmin, authController.postUserSignup);

router.post('/logout', authController.postLogout);

module.exports = router;