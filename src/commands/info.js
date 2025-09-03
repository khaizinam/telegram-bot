const { sendMessage } = require("../utils/prepare");

module.exports = {
    alias: 'info',
    group: 'general',
    desc: 'Show Current Group/User info',
    handler: async (msg, match, bot) => {
        try {
            const botInfo = await bot.getMe();

            let replyText = "━━━━━━━━━━━━━━━\n";
            replyText += "🤖 BOT THÔNG TIN HIỆN TẠI\n";
            replyText += "━━━━━━━━━━━━━━━\n";
            replyText += `- 🔹 Bot Name: ${botInfo.first_name}\n`;
            replyText += `- 🔹 Bot Username: @${botInfo.username}\n\n`;

            replyText += "👤 NGƯỜI DÙNG\n";
            replyText += `- ID: ${msg.from.id}\n`;
            replyText += `- Tên: ${msg.from.first_name} ${msg.from.last_name || ""}\n\n`;

            const chatType = msg.chat.type;
            if (chatType !== "private") {
                replyText += "💬 NHÓM CHAT\n";
                replyText += `- Tên: ${msg.chat.title}\n`;
                replyText += `- Chat ID: ${msg.chat.id}\n`;
                replyText += `- Kiểu: ${chatType}\n\n`;

                if (msg.message_thread_id) {
                    let topicName = null;
                    if (msg.forum_topic_created) {
                        topicName = msg.forum_topic_created.name;
                    } else if (
                        msg.reply_to_message &&
                        msg.reply_to_message.forum_topic_created
                    ) {
                        topicName = msg.reply_to_message.forum_topic_created.name;
                    }
                    replyText += "🧩 CHỦ ĐỀ\n";
                    replyText += `- ID: ${msg.message_thread_id}\n`;
                    if (topicName) {
                        replyText += `- Tên: ${topicName}\n`;
                    }
                    replyText += "\n";
                }
            }

            replyText += "━━━━━━━━━━━━━━━\n";
            replyText += "🌟 Sản phẩm được phát triển bởi **khaizinam**\n";
            replyText += "© 2025 khaizinam. All rights reserved.\n";
            replyText += "━━━━━━━━━━━━━━━";

            await sendMessage(bot, replyText, msg, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "🌍 Website", url: "https://my.khaizinam.site" },
                            { text: "💻 GitHub", url: "https://github.com/khaizinam" }
                        ]
                    ]
                },
                parse_mode: "Markdown"
            });
        } catch (error) {
            await sendMessage(bot, `❌ Xảy ra lỗi:\n${error.message}`, msg);
        }
    }
};
