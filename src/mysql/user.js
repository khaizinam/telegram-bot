const { pool } = require('./pool');
/**
 * TABLE: app_users
 * id bigint
 * user_id varchar
 * user_name varchar
 * nickname varchar
 * last_hunt timestamp
 * created_at datetime
 * updated_at datetime
 */
async function findUserByTelegramId(userId) {
  const [rows] = await pool.execute('SELECT * FROM app_users WHERE user_id = ?', [userId]);
  return rows.length > 0 ? rows[0] : null;
}

async function createUser(userId, username, nickname) {
  await pool.execute(`
    INSERT INTO app_users (user_id, user_name, nickname, created_at, updated_at, last_hunt)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL)
  `, [userId, username, nickname]);
}

async function updateLastTime(userId) {
  await pool.execute(`
    UPDATE app_users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = ?
  `, [userId]);
}

async function deleteUser(userId) {
  await pool.execute('DELETE FROM app_users WHERE user_id = ?', [userId]);
}

async function getUserList(page = 1, perPage = 10) {
    const offset = (page - 1) * perPage;

    const [totalRows] = await pool.query('SELECT COUNT(*) AS count FROM app_users');
    const total = totalRows[0].count;

    const [users] = await pool.query(`
        SELECT user_name, user_id, created_at, updated_at
        FROM app_users
        ORDER BY created_at DESC
        LIMIT ${perPage} OFFSET ${offset}
    `);

    return { total, users };
}

module.exports = {
  findUserByTelegramId,
  createUser,
  updateLastTime,
  deleteUser,
  getUserList
};
