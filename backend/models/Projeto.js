const pool = require('../config/database');

class Projeto {
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  static async create(userId, data) {
    const id = this.generateId();
    await pool.execute(
      `INSERT INTO projetos (id, user_id, cliente_id, cliente_nome, tipo, valor, prazo, status_projeto, progresso, obs, data_inicio) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, userId, data.clienteId, data.clienteNome, data.tipo, data.valor, data.prazo, data.statusProjeto, data.progresso, data.obs]
    );
    return id;
  }

  static async getAll(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM projetos WHERE user_id = ? ORDER BY data_inicio DESC',
      [userId]
    );
    return rows;
  }

  static async getById(userId, id) {
    const [rows] = await pool.execute(
      'SELECT * FROM projetos WHERE user_id = ? AND id = ?',
      [userId, id]
    );
    return rows[0];
  }

  static async update(userId, id, data) {
    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const params = Object.values(data);
    params.push(userId, id);
    
    await pool.execute(
      `UPDATE projetos SET ${fields}, updated_at = NOW() WHERE user_id = ? AND id = ?`,
      params
    );
  }

  static async delete(userId, id) {
    await pool.execute('DELETE FROM projetos WHERE user_id = ? AND id = ?', [userId, id]);
  }
}

module.exports = Projeto;
