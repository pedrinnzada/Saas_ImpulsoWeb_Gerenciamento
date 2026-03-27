const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, nome, role) VALUES (?, ?, ?, ?)',
      [data.email, hashedPassword, data.nome, data.role || 'user']
    );
    const user = await this.findByEmail(data.email);
    return user;
  }

  static async validatePassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) return null;
    return user;
  }
}

module.exports = User;
