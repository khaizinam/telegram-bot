require('dotenv').config();
const { prepareUser } = require('./src/utils/prepare');
const TelegramBot = require('node-telegram-bot-api');
const redis = require('./src/redis');
const mysql = require('mysql2');

// Tạo kết nối
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Mở kết nối và log trạng thái
connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err.message);
    process.exit(1); // Dừng chương trình nếu không kết nối được
  }
  console.log('✅ MySQL connected successfully.');
});

// Bắt sự kiện mất kết nối (nếu cần auto reconnect)
connection.on('error', (err) => {
  console.error('❗ MySQL Error:', err);
  // Tùy chọn: bạn có thể thực hiện reconnect tại đây nếu cần
});

redis.ping().then(res => {
  console.log('✅ Redis connected:', res);
}).catch(err => {
  console.error('❌ Redis connection failed:', err.message);
});

if (!process.env.TELEGRAM_TOKEN) {
  console.error('❌ TELEGRAM_TOKEN không được cấu hình trong .env');
  process.exit(1);
}

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
