const { get_market_notify, add_market_notify, delete_market_notify } = require('../mysql/crypto');
const { sendMessage } = require('../utils/prepare');

module.exports = {
  alias: 'notify',
  group: 'crypto',
  desc: 'Danh sách notify crypto OKX.',
  usage: '/notify list <page|1>, /notify add <coinid>, /notify delete <id>',
  hide: false,
  handler: async (msg, args, bot) => {
    try {
      const chatId = msg.chat.id;
      const telegram_uid = msg.from.id;
      
      if (args.length === 0) {
        return await sendMessage(bot,'⚠️ Dùng: \n/notify list <?page=1>\n/notify add <coinid>\n/notify delete <id>', msg);
      }
      
      const action = args[0].toLowerCase();
      // LIST
      if (action === 'list') {
        let page = 1;
        if (args.length > 1 && !isNaN(args[1])) {
          page = parseInt(args[1]);
        }
        const limit = 20; // cố định 20
        const list = await get_market_notify(page, limit, telegram_uid);
        if (!list || list.length === 0) {
          return await sendMessage(bot,`📭 Không có notify nào ở trang ${page}.`, msg);
        }
        // format kết quả
        let text = `📌 Danh sách notify (Trang ${page})\n\n`;
        list.forEach((row, idx) => {
          text += `${idx + 1}. ID: ${row.id}\n`;
          text += `   Spot type: ${row.coinid}\n`;
          text += `   UID: ${row.telegram_uid}\n`;
          text += `   Chat ID: ${row.chat_id}\n`;
          text += `   Topic ID: ${row.thread_id}\n`;
          text += `   Status: ${row.status}\n`;
          text += `   Created: ${row.created_at}\n\n`;
        });
        return await sendMessage(bot,text, msg);
      }
      // ADD
      if (action === 'add') {
        if (!args[1]) {
          return await sendMessage(bot, '⚠️ Bạn cần nhập coinid. Ví dụ: `/notify add TON-USDT`', msg, { parse_mode: 'Markdown'});
        }
        const coinid = args[1].toUpperCase();
        const inserted = await add_market_notify({
          telegram_uid,
          coinid,
          chat_id: chatId,
          thread_id: msg.message_thread_id || '',
        });

        if (inserted) {
          return await sendMessage(bot, `✅ Notify mới đã được tạo!\n` +
            `UID: ${telegram_uid}\n` +
            `Coin Type: ${coinid}\n` +
            `Chat ID: ${chatId}\n` +
            `Topic ID: ${msg.message_thread_id || ''}`, 
            msg
          );
        } else {
          return await sendMessage(bot, `❌ Không thể tạo notify.`, msg);
        }
      }
      // DELETE
      if (action === 'delete') {
        if (args.length < 2 || isNaN(args[1])) {
          return await sendMessage(bot, '⚠️ Dùng: /notify delete <id>', msg);
        }
        const id = parseInt(args[1]);
        const deleted = await delete_market_notify(id, telegram_uid);
        if (deleted) {
          return await sendMessage(bot, `🗑 Notify #${id} đã được xóa.`, msg);
        } else {
          return await sendMessage(bot,  `❌ Bạn không sở hữu notify #${id} hoặc notify không tồn tại.`, msg);
        }
      }
      return await sendMessage(bot, '⚠️ Cú pháp không hợp lệ.', msg);
    } catch (err) {
      return await sendMessage(bot, '❌ Có lỗi xảy ra.\n' + err.message, msg);
    }
  },
};
