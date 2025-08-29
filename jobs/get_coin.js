// CommonJS
require("dotenv").config();
const { getPrice } = require("../src/utils/okx.js");
const bot = require('../src/bot.js');
const { getLastCoinPrice, insertCoinPrice, getActiveNotify } = require("../src/mysql/crypto.js");
const cron = require('node-cron');

async function run() {
  console.log("Start running.");
  try {
    const coinid = "TON-USDT";
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
      if (Math.abs(diff) >= 1) needNotify = true; // chỉ thông báo khi thay đổi ≥1%
    } else {
      needNotify = true; // lần đầu insert
    }

    // Lưu giá hiện tại vào DB
    await insertCoinPrice(coinid, {
      currentPrice,
      high24h,
      low24h,
    });

    if (!needNotify) return;

    // Lấy danh sách tất cả room cần notify
    const notifyList = await getActiveNotify(coinid);

    const trend = diff > 0 ? "📈 Tăng" : "📉 Giảm";

    const txt = `
⚡ Thông báo giá thay đổi
- Đồng: ${coinid}
- Giá hiện tại: ${currentPrice} USDT
- ${trend} ${diff.toFixed(2)}%
- Thời gian: ${new Date().toLocaleString("vi-VN")}
- Cao nhất 24h: ${high24h}
- Thấp nhất 24h: ${low24h}
    `;

    for (const row of notifyList) {
      const opts = {};
      if (row.thread_id) opts.message_thread_id = row.thread_id;
      await bot.sendMessage(row.chat_id, txt, opts);
    }
  } catch (err) {
    console.error("Error in run:", err);
  }
};

// Cron chạy mỗi 1 phút
cron.schedule('*/5 * * * *', async () => {
  try {
    await run();
  } catch (err) {
    console.error('Lỗi khi chạy cron:', err);
  }
});
console.log('Cron đã được lên lịch chạy mỗi 5 phút');
