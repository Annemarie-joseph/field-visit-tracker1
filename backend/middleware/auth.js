const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح — سجل دخولك أولاً' });
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.user = payload; // { id, username, role }
    next();
  } catch {
    res.status(401).json({ error: 'الجلسة انتهت، سجل دخولك مرة تانية' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'محتاج صلاحيات مشرف' });
  }
  next();
}

module.exports = { authenticate, requireAdmin };
