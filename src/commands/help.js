const { sendMessage } = require("../utils/prepare");

module.exports = {
  alias: 'help',
  group: 'general',
  desc: 'Xem chi tiết hướng dẫn của một lệnh cụ thể.',
  usage: '/help <cmd>',
  handler: async (msg, args, bot) => {
    const chatId = msg.chat.id;
    const [commandName] = args;

    if (!commandName) {
      return bot.sendMessage(chatId, `❗ Vui lòng dùng đúng cú pháp: /help <command>`);
    }

    try {
      const command = require(`./${commandName}.js`);
      const message = `*Lệnh:* /${command.alias}\n*Nhóm:* ${command.group}\n*Mô tả:* ${command.desc}`;
      await sendMessage(bot,  message, msg, { parse_mode: 'Markdown' })
    } catch (err) {
      await sendMessage(bot,  `❌ Không tìm thấy lệnh *${commandName}*`, msg, { parse_mode: 'Markdown' })
    }
  }
};
