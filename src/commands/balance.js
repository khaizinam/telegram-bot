const { getBalance } = require("../utils/okx");
const { sendMessage } = require("../utils/prepare");

module.exports = {
  alias: 'balance',
  group: 'crypto',
  desc: 'Số dư tài khoản của OKX.',
  usage: '/balance <coinid|TON>',
  hide: false,
  handler: async (msg, args, bot) => {
    try {
      const coinid = args[0] ? args[0].trim().toUpperCase() : "TON";
      const bal = await getBalance(coinid);
      
      if (!bal) {
        return await sendMessage(bot, `❌ Không lấy được số dư ${coinid}`, msg);
      }
      const text = `💰 Số dư ${coinid}:\n- Có sẵn: ${bal.available}\n- Tổng: ${bal.total}`;

      return await sendMessage(bot, text, msg);
    } catch (err) {
      return await sendMessage(bot, '❌ Có lỗi xảy ra.\n' + err.message, msg);
    }
  },
};
