const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid'); // npm i uuid later if needed, fallback Date.now

class Cliente {
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  static async create(userId, data) {
    const id = this.generateId();
    await pool.execute(
      `INSERT INTO clientes (id, user_id, nome, idade, telefone, email, empresa, servico, valor, status, prioridade, obs, data_cadastro) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, userId, data.nome, data.idade, data.telefone, data.email, data.empresa, data.servico, data.valor, data.status, data.prioridade, data.obs]
    );
    return id;
  }

  static async getAll(userId, filters = {}) {
    let query = `SELECT * FROM clientes WHERE user_id = ?`;
    const params = [userId];
    
    if (filters.status) {
      query += ` AND status = ?`;
      params.push(filters.status);
    }
    if (filters.search) {
      query += ` AND (nome LIKE ? OR email LIKE ? OR empresa LIKE ? OR servico LIKE ?)`;
      const s = `%${filters.search}%`;
      params.push(s, s, s, s);
    }
    
    query += ` ORDER BY FIELD(prioridade, 'alta','normal','baixa'), data_cadastro DESC`;
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getById(userId, id) {
    const [rows] = await pool.execute(
      'SELECT * FROM clientes WHERE user_id = ? AND id = ?',
      [userId, id]
    );
    return rows[0];
  }

  static async update(userId, id, data) {
    const fields = [];
    const params = [userId, id];
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    });
    
    if (fields.length === 0) return;
    
    await pool.execute(
      `UPDATE clientes SET ${fields.join(', ')}, updated_at = NOW() WHERE user_id = ? AND id = ?`,
      params
    );
  }

  static async delete(userId, id) {
    await pool.execute('DELETE FROM clientes WHERE user_id = ? AND id = ?', [userId, id]);
  }
}

module.exports = Cliente;
