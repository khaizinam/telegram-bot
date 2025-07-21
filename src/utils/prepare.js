const db = require('../db');

/**
 * Kiểm tra và chuẩn bị user trong database
 * @param {Object} telegramUser - msg.from từ Telegram
 * @returns {void}
 */
function prepareUser(telegramUser) {
  const userId = telegramUser.id.toString();
  const username = telegramUser.username || 'người dùng';

  try {
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
    if (!user) {
      db.prepare(`
        INSERT INTO users (user_id, username, created_at, lasttime_at)
        VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(userId, username);
      console.log(`✅ User mới: ${userId} (${username})`);
    } else {
      db.prepare('UPDATE users SET lasttime_at = CURRENT_TIMESTAMP WHERE user_id = ?')
        .run(userId);
    }
  } catch (err) {
    console.error('❌ DB ERROR tại prepareUser:', err);
  }
}

module.exports = {
  prepareUser,
};
