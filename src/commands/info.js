const { sendMessage } = require("../utils/prepare");

module.exports = {
    alias: 'info',
    group: 'general',
    desc: 'Show Current Group/User info',
    handler: async (msg, match, bot) => {
        const chatType = msg.chat.type; // private | group | supergroup | channel
        let replyText = "📌 Thông tin hiện tại.\n";

        if (chatType === 'private') {
            // Nếu là user
            replyText += `- User ID: ${msg.from.id}\n`;
            replyText += `- Name: ${msg.from.first_name} ${msg.from.last_name || ''}`.trim();
        } else {
            // Nếu là group/supergroup/channel
            replyText += `- Chat Name: ${msg.chat.title}\n`;
            replyText += `- Chat ID: ${msg.chat.id}\n`;
            replyText += `- Chat Type: ${chatType}\n`;

            // Nếu có topic
            if (msg.message_thread_id) {
                let topicName = null;

                // Khi nhận tin đầu tiên tạo topic, Telegram có field forum_topic_created
                if (msg.forum_topic_created) {
                    topicName = msg.forum_topic_created.name;
                } else if (
                    msg.reply_to_message &&
                    msg.reply_to_message.forum_topic_created
                ) {
                    topicName = msg.reply_to_message.forum_topic_created.name;
                }

                replyText += `- Topic ID: ${msg.message_thread_id}\n`;
                if (topicName) {
                    replyText += `- Topic Name: ${topicName}\n`;
                }
            }
        }

        await sendMessage(bot, replyText, msg);
    }
};
