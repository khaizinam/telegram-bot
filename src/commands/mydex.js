const { getMyPets } = require('../mysql/battle');
const { sendMessage } = require('../utils/prepare');

module.exports = {
    alias: 'mydex',
    group: 'batle',
    desc: 'My dex',
    handler: async (msg, match, bot) => {
        const userId = msg.from.id;
        const page = parseInt(match[0]) || 1;
        const perPage = 10;

        try {
            const { total, pets } = await getMyPets(userId, page, perPage);
            const totalPages = Math.max(Math.ceil(total / perPage), 1);

            if (pets.length === 0) {
                return await bot.sendMessage(msg.chat.id, '📭 Bạn chưa sở hữu thú nào cả.');
            }

            const petLines = pets.map((p, index) => {
                const date = new Date(p.created_at).toLocaleDateString('vi-VN');
                return `${index + 1}. *${p.pet_name}* (#${p.id})\n- Dex: \`${p.pet_id}\`\n- Level: \`${p.level}\`\n- First caught: ${date}`;
            }).join('\n\n');

            const replyText = `*📘 Danh sách Pet của bạn* (Tổng: ${total})\n\n${petLines}\n\n📄 Trang (${page}/${totalPages})`;

            await sendMessage(bot, replyText, msg, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            });

        } catch (err) {
            console.error('Lỗi khi xử lý /mydex:', err);
            await sendMessage(bot, '❌ Đã xảy ra lỗi khi lấy danh sách pet.', msg);
        }
    }
};
