module.exports = {
    alias: 'ping',
    group: 'general',
    desc: 'This helper bot run',
    handler: async (msg, match, bot) => {
        const chatId = msg.chat.id;
        await bot.sendMessage(chatId, 'Pong! 🏓');
    }
};