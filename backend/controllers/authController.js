const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
async function register(req, res) {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password) {
      return res.status(400).json({ error: 'اسم المستخدم وكلمة السر مطلوبين' });
    }
    const exists = await User.findOne({ username: username.trim() });
    if (exists) {
      return res.status(409).json({ error: 'اسم المستخدم موجود بالفعل، اختار اسم تاني' });
    }
    await User.create({ username: username.trim(), password, role: 'user', status: 'approved' });
    res.status(201).json({ message: 'تم التسجيل بنجاح! تقدر تسجل دخولك دلوقتي.' });
  } catch (err) {
    res.status(500).json({ error: 'فشل التسجيل', details: err.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username?.trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة السر غلط' });
    }
    if (user.status === 'pending') {
      return res.status(403).json({ error: 'حسابك لسه في انتظار موافقة المشرف' });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'فشل تسجيل الدخول', details: err.message });
  }
}

// GET /api/auth/users  (admin)
async function getAllUsers(req, res) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/auth/users/pending  (admin)
async function getPendingUsers(req, res) {
  try {
    const users = await User.find({ status: 'pending' }).select('-password').sort({ createdAt: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /api/auth/users/:id/approve  (admin)
async function approveUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'المستخدم مش موجود' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/auth/users/:id  (admin)
async function deleteUser(req, res) {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'المستخدم مش موجود' });
    res.json({ status: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login, getAllUsers, getPendingUsers, approveUser, deleteUser };
