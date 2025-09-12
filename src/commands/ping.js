const { sendMessage } = require("../utils/prepare");

module.exports = {
    alias: 'ping',
    group: 'general',
    desc: 'This helper bot run',
    usage: '/ping',
    hide: false,
    handler: async (msg, match, bot) => {
        const chatId = msg.chat.id;
        await sendMessage(bot, 'Pong! 🏓', msg);
    }
};