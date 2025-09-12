// commands/showuser.js
const { getUserList } = require('../mysql/user');
const { sendMessage, sendMessageError } = require('../utils/prepare');
const moment = require('moment-timezone'); // 👉 thêm

module.exports = {
    alias: 'showuser',
    group: 'general',
    desc: 'Xem danh sách người dùng đã kết nối. /showuser <page>',
    hide: false,
    handler: async (msg, args, bot) => {
        const chatId = msg.chat.id;
        const page = parseInt(args[0]) || 1;
        const perPage = 10;
        const offset = (page - 1) * perPage;
        try {
            const { total, users } = await getUserList(page, perPage);
            if (users.length === 0) {
                await bot.sendMessage(chatId, `❌ Không có user nào ở trang ${page}.`);
                return;
            }

            let message = `*Danh sách user* (Trang ${page}/${Math.ceil(total / perPage)}):\n\n`;
            users.forEach((user, index) => {
                const createdAt = user.created_at
                    ? moment(user.created_at).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss')
                    : 'N/A';
                const updatedAt = user.updated_at
                    ? moment(user.updated_at).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss')
                    : 'N/A';

                message += `*${offset + index + 1}. @${user.user_name || 'N/A'}*\n`;
                message += `ID: \`${user.user_id}\`\n`;
                message += `Đăng ký: _${createdAt}_\n`;
                message += `Lần cuối: _${updatedAt}_\n\n`;
            });

            await sendMessage(bot, message.trim(), msg, { parse_mode: 'Markdown' });
        } catch (err) {
            await sendMessageError(bot, err, msg);
        }
    }
};
