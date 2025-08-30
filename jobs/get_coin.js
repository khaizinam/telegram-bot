// CommonJS
require("dotenv").config();
const { getPrice } = require("../src/utils/okx.js");
const bot = require('../src/bot.js');
const { getLastCoinPrice, insertCoinPrice, getActiveNotify } = require("../src/mysql/crypto.js");
const cron = require('node-cron');

const coinids = [
  "TON-USDT",
  "BTC-USDT",
  "DUCK-USDT"
];

const PRICE_NOTIFY = 1;

async function run() {
  console.log("start running.");
  for (const [i, coinid] of coinids.entries()) {
    console.log(`${i}. Get update with ${coinid} start:`);
    try {
      const data = await getPrice(coinid);

      if (!data || !data.data || data.data.length === 0) return;
      const ticker = data.data[0];

      const currentPrice = parseFloat(ticker.last);
      const high24h = parseFloat(ticker.high24h);
      const low24h = parseFloat(ticker.low24h);

      // Lấy giá lần cập nhật trước trong DB
      const lastRow = await getLastCoinPrice(coinid);

      let needNotify = false;
      let diff = 0; // phần trăm so với lần trước
      if (lastRow) {
        const lastData = JSON.parse(lastRow.data_json);
        const lastPrice = parseFloat(lastData.currentPrice);
        diff = ((currentPrice - lastPrice) / lastPrice) * 100;
        if (Math.abs(diff) >= PRICE_NOTIFY) needNotify = true; // chỉ thông báo khi thay đổi ≥1%
      } else {
        needNotify = true; // lần đầu insert
      }

      console.log("Current price " + currentPrice);
      
      if (!needNotify) continue;

      await insertCoinPrice(coinid, {
        currentPrice,
        high24h,
        low24h,
      });

      // Lấy danh sách tất cả room cần notify
      const notifyList = await getActiveNotify(coinid);

      const trend = diff > 0 ? "📈 Tăng" : "📉 Giảm";

      let txt = `⚡ Thông báo giá thay đổi\n`
      + `- Đồng: ${coinid}\n`
      + `- Giá hiện tại: ${currentPrice} USDT\n`
      + `- ${trend} ${diff.toFixed(2)}%\n`
      + `- Thời gian: ${new Date().toLocaleString("vi-VN")}\n`
      + `- Cao nhất 24h: ${high24h}\n`
      + `- Thấp nhất 24h: ${low24h}`;

      for (const row of notifyList) {
        const opts = {};
        if (row.thread_id) opts.message_thread_id = row.thread_id;
        await bot.sendMessage(row.chat_id, txt, opts);
      }

    } catch (err) {
      console.error(err);
      continue;
    }
  }
};

async function runCron() {
  try {
    await run(); // chạy ngay lần đầu
  } catch (err) {
    console.error('Lỗi khi chạy cron:', err);
  }
}

// Chạy lần đầu ngay khi start
runCron();

// Lên lịch chạy mỗi 5 phút sau đó
cron.schedule('*/5 * * * *', runCron);

console.log('Cron đã được lên lịch chạy mỗi 5 phút và chạy ngay lần đầu');
