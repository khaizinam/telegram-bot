const { pool, TABLES } = require('./pool');

module.exports = {
  get_market_notify: async (page = 1, limit = 20, telegram_uid) => {
    const offset = (page - 1) * limit;
    const [rows] = await pool.execute(
      `SELECT * FROM ${TABLES.MARKET_NOTIFY.name} 
       WHERE telegram_uid = ?
       ORDER BY created_at DESC 
       LIMIT ${limit} OFFSET ${offset}`,
      [telegram_uid]
    );
    return rows;
  },

  add_market_notify: async ({ telegram_uid, coinid, chat_id, thread_id }) => {
    try {
      const [result] = await pool.execute(
        `INSERT INTO ${TABLES.MARKET_NOTIFY.name} 
         (telegram_uid, coinid, chat_id, thread_id, status, created_at)
         VALUES (?, ?, ?, ?, 'active', NOW())`,
        [telegram_uid, coinid, chat_id, thread_id]
      );
      return result.affectedRows > 0;
    } catch {
      return false;
    }
  },

  delete_market_notify: async (id, telegram_uid) => {
    try {
      const [result] = await pool.execute(
        `DELETE FROM ${TABLES.MARKET_NOTIFY.name} WHERE id = ? AND telegram_uid = ?`,
        [id, telegram_uid]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  updateCoinPrice: async (coinid, data) => {
    await pool.query(
      `UPDATE ${TABLES.COIN_MARKET.name} 
       SET data_json = ?, updated_at = NOW() 
       WHERE coinid = ?`,
      [JSON.stringify(data), coinid]
    );
  },

  insertCoinPrice: async (coinid, data) => {
    await pool.query(
      `INSERT INTO ${TABLES.COIN_MARKET.name} 
       (coinid, data_json, created_at, updated_at) 
       VALUES (?, ?, NOW(), NOW())`,
      [coinid, JSON.stringify(data)]
    );
  },

  getLastCoinPrice: async (coinid) => {
    const [rows] = await pool.query(
      `SELECT id, data_json, created_at 
       FROM ${TABLES.COIN_MARKET.name} 
       WHERE coinid = ? ORDER BY updated_at DESC LIMIT 1`,
      [coinid]
    );
    return rows[0] || null;
  },

  getActiveNotify: async (coinid) => {
    const [rows] = await pool.query(
      `SELECT * FROM ${TABLES.MARKET_NOTIFY.name} 
       WHERE coinid = ? AND status = 'active'`,
      [coinid]
    );
    return rows;
  },

  get_active_notify_by_coin: async (coinid="TON-USDT") => {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM ${TABLES.MARKET_NOTIFY.name} 
         WHERE coinid = ? AND status = 'active' 
         ORDER BY created_at DESC`,
        [coinid]
      );
      return rows;
    } catch {
      return [];
    }
  },

  getActiveCoinIds: async () => {
    const [rows] = await pool.query(
      `SELECT DISTINCT coinid FROM ${TABLES.MARKET_NOTIFY.name} 
       WHERE status = 'active'`
    );
    return rows.map(r => r.coinid);
  }
};
