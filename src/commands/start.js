// commands/start.js
const fs = require('fs');
const { sendMessage } = require('../utils/prepare');

module.exports = {
  alias: 'start',
  group: 'general',
  desc: 'Giới thiệu bot và liệt kê các lệnh đang có',
  usage: '/start',
  handler: async (msg, args, bot) => {
    const username = msg.from.username || 'người dùng';

    // Đọc danh sách command
    const commandFiles = fs.readdirSync(__dirname);
    const groups = {};

    for (const file of commandFiles) {
      if (file.endsWith('.js')) {
        const command = require(`./${file}`);
        if (!command.alias || !command.group || !command.desc) continue;
        if (command.hide) continue;
        if (!groups[command.group]) groups[command.group] = [];
        groups[command.group].push({ alias: command.alias, desc: command.desc });
      }
    }

    let message = `👋 Hello *${username}*, welcome to *Khaizinam Bot!*\n\n` +
      `This bot supports commands grouped by features.\nUse /help <command> to see detailed usage.\n\n`;

    for (const [group, cmds] of Object.entries(groups)) {
      message += `*${group.toUpperCase()}*\n`;
      for (const cmd of cmds) {
        message += `• /${cmd.alias} — _${cmd.desc}_\n`;
      }
      message += '\n';
    }
    await sendMessage(bot,  message.trim(), msg, { parse_mode: 'Markdown' });
  }
};
