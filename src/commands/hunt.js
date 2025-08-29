const { startHunt } = require("../mysql/battle");
const { sendMessage } = require("../utils/prepare");

module.exports = {
    alias: 'hunt',
    group: 'batle',
    desc: 'Hunt animals',
    handler: async (msg, match, bot) => {
        const userId = msg.from.id;
        console.log(userId);
        const result = await startHunt(userId);
        console.log(result);
        if (!result.success) {
            await bot.sendMessage(msg.chat.id, `❌ ${result.message}`);
            return;
        }

        const lines = result.pets.map(pet => `- ${pet.name} : 1`);

        const reply = `*Bạn đã săn được*\n` + lines.join('\n');

        await sendMessage(bot, reply, msg, { parse_mode: 'Markdown'} );
    }
};
