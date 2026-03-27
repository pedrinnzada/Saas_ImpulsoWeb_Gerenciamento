const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    if (!rows[0]) return res.status(401).json({ error: 'Invalid token' });

    req.user = rows[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalid/expired' });
  }
};

module.exports = auth;
