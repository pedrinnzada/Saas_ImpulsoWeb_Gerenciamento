const pool = require('../config/database');

class Notification {
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  static async create(userId, msg, type = 'info') {
    const id = this.generateId();
    await pool.execute(
      'INSERT INTO notifications (id, user_id, msg, type, ts) VALUES (?, ?, ?, ?, NOW())',
      [id, userId, msg, type]
    );
  }

  static async getAll(userId, unreadOnly = false) {
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [userId];
    if (unreadOnly) {
      query += ' AND read = FALSE';
    }
    query += ' ORDER BY ts DESC LIMIT 20';
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async markAllRead(userId) {
    await pool.execute('UPDATE notifications SET read = TRUE WHERE user_id = ? AND read = FALSE', [userId]);
  }

  static async getUnreadCount(userId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = FALSE',
      [userId]
    );
    return rows[0].count;
  }
}

module.exports = Notification;
