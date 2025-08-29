// CommonJS
require("dotenv").config();
const { getPrice } = require("../src/utils/okx.js");
const bot = require('../src/bot.js');
const { getLastCoinPrice, insertCoinPrice, getActiveNotify } = require("../src/mysql/crypto.js");

async function run(){
  console.log("Start running.");
  try {
    const coinid = "TON-USDT";
    const data = await getPrice(coinid);

    if (!data || !data.data || data.data.length === 0) return;
    const ticker = data.data[0];

    const currentPrice = parseFloat(ticker.last);
    const high24h = parseFloat(ticker.high24h);
    const low24h = parseFloat(ticker.low24h);

    // Lấy giá gần nhất trong DB
    const lastRow = await getLastCoinPrice(coinid);

    let needNotify = false;
    if (lastRow) {
      const lastData = JSON.parse(lastRow.data_json);
      const lastPrice = parseFloat(lastData.currentPrice);
      const diff = ((currentPrice - lastPrice) / lastPrice) * 100;
      if (Math.abs(diff) >= 1) needNotify = true;
    } else {
      needNotify = true; // lần đầu insert
    }

    await insertCoinPrice(coinid, {
      currentPrice,
      high24h,
      low24h,
    });

    if (!needNotify) return;

    // Lấy danh sách tất cả room cần notify
    const notifyList = await getActiveNotify(coinid);

    const trend = lastRow && (currentPrice - parseFloat(JSON.parse(lastRow.data_json).currentPrice) > 0)
      ? "📈 Tăng"
      : "📉 Giảm";

    const txt = `
⚡ Thông báo giá thay đổi
- Đồng: ${coinid}
- Giá hiện tại: ${currentPrice} USDT
- ${trend}
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
(async () => {
  try {
    await run();
  } catch (err) {
    console.error(err);
  }
})();
