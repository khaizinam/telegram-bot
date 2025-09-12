const { getPetById } = require("../mysql/battle");
const { getEvolClass, describeSkillEffects } = require("../utils/battle");
const { sendMessage } = require("../utils/prepare");

module.exports = {
    alias: 'petinfo',
    group: 'batle',
    desc: 'Xem thông tin chi tiết của Pet bạn sở hữu',
    usage: '/petinfo <ID>',
    hide: false,
    handler: async (msg, args, bot) => {
        const userId = msg.from.id;
        const petInstanceId = parseInt(args[0]);

        if (!petInstanceId) {
            return await bot.sendMessage(msg.chat.id, '⚠️ Vui lòng nhập ID của thú, ví dụ: /petinfo 2');
        }

        const pet = await getPetById(petInstanceId, userId);
        if (!pet) {
            return await bot.sendMessage(msg.chat.id, '❌ Không tìm thấy pet này hoặc không thuộc quyền sở hữu của bạn.');
        }

        const info = JSON.parse(pet.pet_info);
        const caughtDate = new Date(pet.created_at).toLocaleDateString('vi-VN');

        const replyText = `🐾 *Thông tin Pet (#${pet.id})*\n`
            + `*Tên:* ${pet.pet_name}\n`
            + `*Dex:* \`${pet.pet_id}\`\n`
            + `*Level:* ${pet.level} (${pet.exp_level} EXP)\n`
            + `*Hệ:* ${info.element}\n`
            + `*Bậc:* ${getEvolClass(info.evol)}\n`
            + `*Ngày bắt:* ${caughtDate}\n\n`
            + `🧬 *Chỉ số*\n`
            + `- HP: ${info.hp}\n`
            + `- ATK: ${info.atk}\n`
            + `- MAG: ${info.mag}\n`
            + `- Phys DEF: ${info.physic_def}\n`
            + `- Mag DEF: ${info.mag_def}\n`
            + `- Speed: ${info.speed}\n\n`
            + `🎯 *Kỹ năng:* ${info.skill.name}\n`
            + `${describeSkillEffects(info.skill.effects)}`;
        await sendMessage(bot, replyText, msg, { parse_mode: 'Markdown' });
    }
};
