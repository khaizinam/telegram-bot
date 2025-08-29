const { pool } = require('./pool');
const fs = require('fs');
const path = require('path');
/**
 * TABLE: users_pets
 * id bigint
 * user_id varchar
 * pet_id varchar
 * pet_name varchar
 * pet_info JSON
 * level integer
 * exp_level bigint
 * status varchar
 * created_at datetime
 */

/**
 * Lấy danh sách pet theo loại (pet_id) của user, có phân trang và đếm số lượng mỗi loại.
 * @param {number} userId - ID người dùng.
 * @param {number} page - Trang hiện tại (mặc định: 1).
 * @param {number} perPage - Số dòng mỗi trang (mặc định: 10).
 * @returns {Promise<{ total: number, pets: any[] }>}
 */
async function getMyPets(userId, page = 1, perPage = 10) {
    const offset = (page - 1) * perPage;
    try {
        // Đếm tổng số loại pet khác nhau theo pet_id
        const [[{ total }]] = await pool.query(
            `SELECT COUNT(*) AS total
            FROM users_pets
            WHERE user_id = ?`,
            [userId]
        );
        // Lấy danh sách pet, group theo pet_id và đếm số lượng
        const [pets] = await pool.query(
            `SELECT id, pet_id, pet_name, user_id, created_at, level
            FROM users_pets
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ${perPage} OFFSET ${offset}`,
            [userId]
        );
        return { total, pets };
    } catch (err) {
        console.error('❌ DB ERROR tại getMyPets:', err);
        return { total: 0, pets: [] };
    }
}

// Đọc toàn bộ pets từ JSON
const petsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../scripts/pet.json'), 'utf-8')
);

function getRandomPets(count = 3) {
    const allPets = Object.entries(petsData);
    const selected = [];
    while (selected.length < count && allPets.length > 0) {
        const idx = Math.floor(Math.random() * allPets.length);
        selected.push(allPets.splice(idx, 1)[0]); // [pet_id, pet_info]
    }
    return selected;
}

async function startHunt(userId) {
    const [rows] = await pool.execute('SELECT * FROM app_users WHERE user_id = ?', [userId]);
    if (rows.length === 0) return { success: false, message: 'User không tồn tại' };

    const user = rows[0];
    const lastHunt = user.last_hunt ? new Date(user.last_hunt).getTime() : 0;
    const now = Date.now();

    if (now - lastHunt < 5000) {
        return { success: false, message: 'Vui lòng đợi trước khi săn tiếp' };
    }

    // Lấy 3 pet ngẫu nhiên
    const randomPets = getRandomPets(3);

    // Thêm từng pet vào DB
    for (const [petId, petInfo] of randomPets) {
        await pool.execute(`
        INSERT INTO users_pets (user_id, pet_id, pet_name, pet_info, level, exp_level, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [ userId, petId, petInfo.name, JSON.stringify(petInfo), 1, 0, 'idle']);
    }

    // Cập nhật lại thời gian last_hunt
    await pool.execute('UPDATE app_users SET last_hunt = CURRENT_TIMESTAMP WHERE user_id = ?', [userId]);

    return {
        success: true,
        message: 'Săn thành công!',
        pets: randomPets.map(([petId, petInfo]) => ({
            pet_id: petId,
            name: petInfo.name,
            element: petInfo.element
        }))
    };
}


async function getPetById(petInstanceId, userId) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM users_pets WHERE id = ? AND user_id = ?`,
            [petInstanceId, userId]
        );
        return rows[0] || null;
    } catch (err) {
        console.error('❌ DB ERROR tại getPetById:', err);
        return null;
    }
}

module.exports = {
    getMyPets,
    startHunt,
    getPetById
};