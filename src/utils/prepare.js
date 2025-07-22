const {createUser, findUserByTelegramId, updateLastTime} = require('../mysql/user');

async function prepareUser(telegramUser) {
  const userId = telegramUser.id.toString();
  const username = telegramUser.username || 'người dùng';

  try {
    const row = await findUserByTelegramId(userId);
    if (!row) {
      await createUser(userId, username, username);
      console.log(`✅ User mới: ${userId} (${username})`);
    }
  } catch (err) {
    console.error('❌ DB ERROR tại prepareUser:', err);
  }
}

module.exports = {
  prepareUser,
};
