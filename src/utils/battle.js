function getEvolClass(key) {
    const evol = {
        "normal": "Common",
        "uncommon": "Uncommon",
        "rare": "Rare",
        "epic": "Epic",
        "legendary": "Legendary",
        "mythic": "Mythic",
        "ancient": "Ancient",
        "divine": "Divine"
    };
    return evol[key] || "Unknown";
}

function describeSkillEffects(effects) {
    return effects.map(effect => {
        switch (effect.type) {
            case 'direct': {
                const scale = Math.round(effect.scale * 100);
                const dmgType = effect.damageType === 'physical' ? 'sát thương vật lý' : 'sát thương phép';
                return `- Gây ${scale}% ${dmgType}.`;
            }
            case 'heal': {
                return `- Hồi ${effect.amount} máu.`;
            }
            case 'buff': {
                const statMap = {
                    "atk": "tấn công",
                    "mag": "phép",
                    "physic_def": "phòng thủ vật lý",
                    "mag_def": "kháng phép",
                    "speed": "tốc độ"
                };
                return `- Tăng ${statMap[effect.buff_type] || effect.buff_type} thêm ${effect.amount} trong ${effect.duration} lượt.`;
            }
            case 'dot': {
                const dotTypeMap = {
                    burn: "thiêu đốt"
                };
                return `- Gây hiệu ứng ${dotTypeMap[effect.effect_type] || effect.effect_type}, ${effect.damagePerTurn} sát thương mỗi lượt trong ${effect.duration} lượt.`;
            }
            case 'shield': {
                return `- Tạo khiên chặn ${effect.amount} sát thương trong ${effect.duration} lượt.`;
            }
            case 'status': {
                const statusMap = {
                    stun: "làm choáng",
                    slow: "làm chậm"
                };
                return `- ${statusMap[effect.effect_type] || `Gây hiệu ứng ${effect.effect_type}`} trong ${effect.duration} lượt.`;
            }
            default:
                return '- Hiệu ứng đặc biệt.';
        }
    }).join('\n');
}

module.exports = {
  getEvolClass,
  describeSkillEffects
};