const { pool } = require('./pool');

/**
 * Lấy danh sách market_notify theo trang cho 1 user
 * @param {number} page 
 * @param {number} limit 
 * @param {number} telegram_uid 
 * @returns {Promise<Array>}
 */
async function get_market_notify(page = 1, limit = 20, telegram_uid) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.execute(
    `SELECT * 
     FROM app_market_notify 
     WHERE telegram_uid = ?
     ORDER BY created_at DESC 
     LIMIT ${limit} OFFSET ${offset}`,
    [telegram_uid]
  );

  return rows;
}

/**
 * Thêm notify mới
 * @param {Object} data 
 * @param {number} data.telegram_uid
 * @param {string} data.coinid
 * @param {number} data.chat_id
 * @param {number|null} data.thread_id
 * @returns {Promise<boolean>}
 */
async function add_market_notify(data) {
  const { telegram_uid, coinid, chat_id, thread_id } = data;

  try {
    const [result] = await pool.execute(
      `INSERT INTO app_market_notify (telegram_uid, coinid, chat_id, thread_id, status, created_at)
       VALUES (?, ?, ?, ?, 'active', NOW())`,
      [telegram_uid, coinid, chat_id, thread_id]
    );
    return result.affectedRows > 0;
  } catch (err) {
    return false;
  }
}

/**
 * Xóa notify theo ID, chỉ xóa nếu thuộc user
 * @param {number} id 
 * @param {number} telegram_uid
 * @returns {Promise<boolean>}
 */
async function delete_market_notify(id, telegram_uid) {
  try {
    const [result] = await pool.execute(
      `DELETE FROM app_market_notify 
       WHERE id = ? AND telegram_uid = ?`,
      [id, telegram_uid]
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.error('delete_market_notify error:', err);
    return false;
  }
}

async function get_active_notify_by_coin(coinid="TON-USDT") {
  try {
    const [rows] = await pool.execute(
      `SELECT * 
       FROM app_market_notify
       WHERE coinid = ? AND status = 'active'
       ORDER BY created_at DESC`,
      [coinid]
    );
    return rows;
  } catch (err) {
    return [];
  }
}

/**
 * Lấy giá gần nhất của coin
 * @param {string} coinid
 * @returns {Promise<object|null>} last row hoặc null
 */
async function getLastCoinPrice(coinid) {
  const [rows] = await pool.query(
    "SELECT id, data_json, created_at FROM app_coinmarket WHERE coinid = ? ORDER BY created_at DESC LIMIT 1",
    [coinid]
  );
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Lưu giá mới vào DB
 * @param {string} coinid
 * @param {object} data {currentPrice, high24h, low24h}
 */
async function insertCoinPrice(coinid, data) {
  await pool.query(
    "INSERT INTO app_coinmarket (coinid, data_json, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
    [coinid, JSON.stringify(data)]
  );
}

/**
 * Lấy danh sách notify của coin đang active
 * @param {string} coinid
 * @returns {Promise<Array>}
 */
async function getActiveNotify(coinid) {
  const [rows] = await pool.query(
    "SELECT * FROM app_market_notify WHERE coinid = ? AND status = 'active'",
    [coinid]
  );
  return rows;
}

module.exports = {
  get_market_notify,
  add_market_notify,
  delete_market_notify,
  get_active_notify_by_coin,
  getActiveNotify,
  insertCoinPrice,
  getLastCoinPrice
};
