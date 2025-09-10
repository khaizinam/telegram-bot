require("dotenv").config();
const { getPrice, formatPrice, getTimeNow, convertToVND } = require("../src/utils/okx.js");
const bot = require('../src/bot.js');
const {
  getLastCoinPrice,
  insertCoinPrice,
  updateCoinPrice,
  getActiveNotify,
  getActiveCoinIds
} = require("../src/mysql/crypto.js");
const cron = require('node-cron');

const PRICE_NOTIFY = 0.5; // 1%

async function fetchCoinData(coinid) {
  const data = await getPrice(coinid);
  if (!data?.data?.length) return null;
  const ticker = data.data[0];
  return {
    currentPrice: parseFloat(ticker.last),
    high24h: parseFloat(ticker.high24h),
    low24h: parseFloat(ticker.low24h)
  };
}

async function processCoin(coinid, index) {
  console.log(`${index}. Updating ${coinid}...`);
  try {
    const newData = await fetchCoinData(coinid);
    if (!newData) return;

    const lastRow = await getLastCoinPrice(coinid);
    let diff = 0;
    let needNotify = false;

    if (lastRow) {
      const lastData = JSON.parse(lastRow.data_json);
      diff = ((newData.currentPrice - lastData.currentPrice) / lastData.currentPrice) * 100;
      if (Math.abs(diff) >= PRICE_NOTIFY) needNotify = true;
    } else {
      needNotify = true; // lần đầu insert
    }

    if (!needNotify) return;

    // Lưu giá
    if (lastRow) await updateCoinPrice(coinid, newData);
    else await insertCoinPrice(coinid, newData);

    // Lấy danh sách notify
    const notifyList = await getActiveNotify(coinid);
    const trend = diff > 0 ? "📈 Up" : "📉 Down";

    const txt = `[*${coinid}*] <code>${formatPrice(newData.currentPrice)} USDT</code> - (<code>${convertToVND(newData.currentPrice)}</code> VND)\n` +
    `💲 LastPrice: <code>${formatPrice(lastData.currentPrice)} USDT</code>\n` +
    `${trend} <code>${diff.toFixed(2)}%</code>\n` +
    `⏰ Time: <code>${getTimeNow()}</code>\n` +
    `⚖ Min(24h): <code>${formatPrice(newData.low24h)} USDT</code>\n` +
    `⚖ Max(24h): <code>${formatPrice(newData.high24h)} USDT</code>`;

    for (const row of notifyList) {
      const opts = { parse_mode: 'HTML' };
      if (row.thread_id) opts.message_thread_id = row.thread_id;
      await bot.sendMessage(row.chat_id, txt, opts);
    }

  } catch (err) {
    console.error(`Error processing ${coinid}:`, err);
  }
}

async function run() {
  console.log("Start running.");
  try {
    const coinids = await getActiveCoinIds();
    for (const [i, coinid] of coinids.entries()) {
      await processCoin(coinid, i);
    }
  } catch (err) {
    console.error('Run error:', err);
  }
}

async function runCron() {
  await run(); // chạy ngay lần đầu
}

// Chạy lần đầu và lên lịch 5 phút
runCron();
cron.schedule('*/5 * * * *', runCron);

console.log('Cron đã được lên lịch chạy mỗi 5 phút và chạy ngay lần đầu');
