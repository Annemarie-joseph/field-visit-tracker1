const express = require('express');
const router  = express.Router();
const { register, login, getAllUsers, getPendingUsers, approveUser, deleteUser } = require('../controllers/authController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login',    login);

// Admin-only user management
router.get('/users',              authenticate, requireAdmin, getAllUsers);
router.get('/users/pending',      authenticate, requireAdmin, getPendingUsers);
router.patch('/users/:id/approve',authenticate, requireAdmin, approveUser);
router.delete('/users/:id',       authenticate, requireAdmin, deleteUser);

module.exports = router;
