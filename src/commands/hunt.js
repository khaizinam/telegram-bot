const { startHunt } = require("../mysql/battle");
const { sendMessage } = require("../utils/prepare");

module.exports = {
    alias: 'hunt',
    group: 'batle',
    desc: 'Hunt animals',
    usage: '/hunt',
    hide: false,
    handler: async (msg, match, bot) => {
        const userId = msg.from.id;
        const result = await startHunt(userId);
        if (!result.success) {
            await sendMessage(bot, `❌ ${result.message}`, msg);
            return;
        }
        const lines = result.pets.map(pet => `- ${pet.name} : 1`);
        const reply = `*Bạn đã săn được*\n` + lines.join('\n');
        await sendMessage(bot, reply, msg, { parse_mode: 'Markdown'} );
    }
};
