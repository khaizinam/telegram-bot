const { getPrice } = require("../utils/okx");
const { sendMessage } = require("../utils/prepare");

module.exports = {
  alias: 'coinprice',
  group: 'crypto',
  desc: 'Xem giá coin trên market OKX.',
  usage: '/coinprice <coinid|TON-USDT>',
  handler: async (msg, args, bot) => {
    let coinid = args[0] ? args[0].trim().toUpperCase() : "TON-USDT";
    
    try {
      let data = await getPrice(coinid);
      if (!data || !data.data || !data.data[0]) {
        await sendMessage(bot, `❌ Không tìm thấy giá cho *${coinid}*`, msg, { parse_mode: 'Markdown' });
        return;
      }

      const ticker = data.data[0];
      const now = new Date();
      const timeStr = now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

      let message = `📢 *Thông báo giá thay đổi*\n\n`
        + `- 💎 Đồng: *${coinid}*\n`
        + `- 💰 Giá hiện tại: *${ticker.last} USDT*\n`
        + `- 🕒 Thời gian: ${timeStr}\n`
        + `- 📈 Cao nhất 24h: *${ticker.high24h} USDT*\n`
        + `- 📉 Thấp nhất 24h: *${ticker.low24h} USDT*`;

      await sendMessage(bot, message, msg, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(err.response?.data || err.message);
      await sendMessage(bot, `❌ Lỗi khi lấy giá *${coinid}*`, msg, { parse_mode: 'Markdown' });
    }
  }
};
