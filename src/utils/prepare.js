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

async function sendMessage(bot, replyText, msg, opts = { parse_mode: 'Markdown' }){
    if (msg.message_thread_id) {
        opts.message_thread_id = msg.message_thread_id;
    }
    await bot.sendMessage(msg.chat.id, replyText, opts);
}

module.exports = {
  prepareUser,
  sendMessage,
  sendMessageError: async (bot, error, msg) => {
    let opts = {
      parse_mode: 'HTML'
    };
    if (msg.message_thread_id) {
        opts.message_thread_id = msg.message_thread_id;
    }
    let txt = '⚠ <strong>Some Error Exists</strong>\n' +
      '----------------------------\n' +
      `${error?.message}` +
      '\n----------------------------\n';
    await bot.sendMessage(msg.chat.id, txt, opts);
  }
};
