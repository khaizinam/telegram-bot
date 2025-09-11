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

    const txt = '⚠ <strong>Thông báo giá thay đổi</strong>\n\n' +
    `💎 <strong>${coinid}</strong>\n` +
    `-------------------\n` +
    `💰 USDT: ${formatPrice(newData.currentPrice)}\n` +
    `💰 VND: ${convertToVND(newData.currentPrice)}\n` +
    `${trend} <strong>${diff.toFixed(2)}%</strong>\n` +
    `📉 Min(24h): <strong>${formatPrice(newData.low24h)} USDT</strong>\n` +
    `📈 Max(24h): <strong>${formatPrice(newData.high24h)} USDT</strong>\n` +
    `-------------------\n` +
    `⏰ ${getTimeNow()} - OKX Market price\n`;

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

// ==== NOTIFY DAILY
async function notifyDaily(coinid) {
  try {
    const newData = await fetchCoinData(coinid);
    if (!newData) return;
    const txt = '📢 <strong>Thông báo giá hàng ngày</strong>\n\n' +
    `💎 <strong>${coinid}</strong>\n` +
    `--------------------------\n` +
    `💰 USDT: <code>${formatPrice(newData.currentPrice)}</code>\n` +
    `💰 VND: <code>${convertToVND(newData.currentPrice)}</code>\n` +
    `📉 Min(24h): <code>${formatPrice(newData.low24h)}</code> USDT\n` +
    `📈 Max(24h): <code>${formatPrice(newData.high24h)}</code> USDT\n`+
    `--------------------------\n`+
    `⏰ ${getTimeNow()} - OKX Market Price.\n\n`;

    const notifyList = await getActiveNotify(coinid);
    for (const row of notifyList) {
      const opts = { parse_mode: 'HTML' };
      if (row.thread_id) opts.message_thread_id = row.thread_id;
      await bot.sendMessage(row.chat_id, txt, opts);
    }
  } catch (err) {
    console.error(`Error processing ${coinid}:`, err);
  }
}

async function runDaily() {
  console.log("Start running.");
  try {
    const coinids = await getActiveCoinIds();
    for (const [i, coinid] of coinids.entries()) {
      await notifyDaily(coinid);
    }
  } catch (err) {
    console.error('Run error:', err);
  }
}

async function runCron2() {
  await runDaily(); // chạy ngay lần đầu
}

// Chạy lần đầu và lên lịch 5 phút
runCron2();

cron.schedule('0 */2 * * *', runDaily);
