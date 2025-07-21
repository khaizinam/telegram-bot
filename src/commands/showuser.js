// commands/showuser.js
const db = require('../db');

module.exports = {
    alias: 'showuser',
    group: 'general',
    desc: 'Xem danh sách người dùng đã kết nối',
    handler: async (msg, args, bot) => {
        const chatId = msg.chat.id;
        const page = parseInt(args[0]) || 1;
        const perPage = 10;
        const offset = (page - 1) * perPage;

        try {
            const total = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
            const users = db.prepare(`
                SELECT username, user_id, created_at, lasttime_at
                FROM users
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `).all(perPage, offset);

            if (users.length === 0) {
                await bot.sendMessage(chatId, `❌ Không có user nào ở trang ${page}.`);
                return;
            }

            let message = `*Danh sách user* (Trang ${page}/${Math.ceil(total / perPage)}):\n\n`;

            users.forEach((user, index) => {
                message += `*${offset + index + 1}. @${user.username || 'N/A'}*\n`;
                message += `ID: \`${user.user_id}\`\n`;
                message += `Đăng ký: _${user.created_at}_\n`;
                message += `Lần cuối: _${user.lasttime_at}_\n\n`;
            });

            await bot.sendMessage(chatId, message.trim(), { parse_mode: 'Markdown' });
        } catch (err) {
            console.error('❌ DB ERROR:', err);
            await bot.sendMessage(chatId, '❌ Không thể truy vấn danh sách user.');
        }
    }
};
