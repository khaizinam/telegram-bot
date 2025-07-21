require('dotenv').config();
const { prepareUser } = require('./src/utils/prepare');
const redis = require('./src/redis');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  polling: true,
});


// Listen for all text messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  if (!text || !text.startsWith('/')) return;

  prepareUser(msg.from);

  const job = {
    event: 'run_command',
    chatId,
    text,
    user: msg.from
  };
  console.log("Add new to queue");
  await redis.rPush('telegrambot_default_queue', JSON.stringify(job));
});
