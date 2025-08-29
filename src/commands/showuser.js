// commands/showuser.js
const { getUserList } = require('../mysql/user');
const { sendMessage } = require('../utils/prepare');

module.exports = {
    alias: 'showuser',
    group: 'general',
    desc: 'Xem danh sách người dùng đã kết nối',
    handler: async (msg, args, bot) => {
        const chatId = msg.chat.id;
        const page = parseInt(args[0]) || 1;
        const perPage = 10;
        try {
            const {total, users} = await getUserList(page, perPage);
            if (users.length === 0) {
                await bot.sendMessage(chatId, `❌ Không có user nào ở trang ${page}.`);
                return;
            }
            let message = `*Danh sách user* (Trang ${page}/${Math.ceil(total / perPage)}):\n\n`;
            users.forEach((user, index) => {
                message += `*${offset + index + 1}. @${user.user_name || 'N/A'}*\n`;
                message += `ID: \`${user.user_id}\`\n`;
                message += `Đăng ký: _${user.created_at}_\n`;
                message += `Lần cuối: _${user.updated_at}_\n\n`;
            });
            await sendMessage(bot, message.trim(), msg, { parse_mode: 'Markdown' });
        } catch (err) {
            console.error('❌ DB ERROR:', err);
            await sendMessage(bot, '❌ Không thể truy vấn danh sách user.', msg);
        }
    }
};
