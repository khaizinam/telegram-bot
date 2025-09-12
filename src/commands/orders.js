const { getOpenOrders } = require("../utils/okx");
const { sendMessage, sendMessageError } = require("../utils/prepare");

module.exports = {
  alias: 'orders',
  group: 'crypto',
  desc: 'Danh sách lệnh đang mở',
  hide: false,
  handler: async (msg, args, bot) => {
    try {
      const instId = args[0] ? args[0].trim().toUpperCase() : "TON-USDT";
      const orders = await getOpenOrders(instId);

      if (!orders || !orders.data || orders.data.length === 0) {
        return await sendMessage(bot, `✅ Không có lệnh nào đang mở cho ${instId}`, msg);
      }
      
      let text = `📋 Lệnh đang mở (${instId}):\n`;
      for (const ord of orders.data) {
        text += `\nID: ${ord.ordId}\n-> ${ord.side.toUpperCase()} ${ord.sz} @ ${ord.px || 'MARKET'}\n⏱ ${ord.state}`;
      }
      return await sendMessage(bot, text, msg);
    } catch (err) {
      return await sendMessageError(bot, err, msg);
    }
  },
};
