require("dotenv").config();
const fs = require("fs");
const path = require("path");
const redis = require("../src/redis");

module.exports = class BaseJob {
    constructor() {
        /** @type {string} Tên hàng đợi Redis */
        this.name = 'telegrambot_default_queue';

        /** @type {string} Thư mục chứa các handler theo event */
        this.folder = '../src/queue/default';

        /** @type {string} Thư mục chứa các lệnh command (nếu cần dùng sau) */
        this.command_folder = '../src/commands';

        /** @type {object[]} Lưu handler đã load (dự phòng nếu mở rộng đa handler) */
        this.queueHandlers = [];

        /** @type {function} Handler hiện tại */
        this.queueHandler = null;

        /** @type {object} Mã màu cho console */
        this.colors = {
            green: (msg) => `\x1b[32m${msg}\x1b[0m`,
            red: (msg) => `\x1b[31m${msg}\x1b[0m`,
            yellow: (msg) => `\x1b[33m${msg}\x1b[0m`,
            cyan: (msg) => `\x1b[36m${msg}\x1b[0m`,
        };
    }

    /**
     * Lấy thời gian hiện tại dưới dạng YYYY-MM-DD HH:MM:SS
     * @returns {string}
     */
    now() {
        return new Date().toISOString().replace("T", " ").substring(0, 19);
    }

    /**
     * Load một file handler theo tên sự kiện (event)
     * @param {string} name - Tên file handler không có đuôi `.js`
     * @returns {void}
     */
    loadFolder(name) {
        try {
            const filePath = path.join(__dirname, this.folder, `${name}.js`);
            if (!fs.existsSync(filePath)) {
                console.log(this.colors.yellow(`[${this.now()}] ⚠️ Handler not found: ${filePath}`));
                this.queueHandler = null;
                return;
            }

            delete require.cache[require.resolve(filePath)];
            this.queueHandler = require(filePath);
        } catch (err) {
            console.error(this.colors.red(`[${this.now()}] ❌ Failed to load handler "${name}":`), err);
            this.queueHandler = null;
        }
    }

    /**
     * Bắt đầu xử lý các job từ Redis queue
     * @returns {Promise<void>}
     */
    async processQueue() {
        console.log(
            this.colors.cyan(`[${this.now()}] 🧵 Queue worker started... Listening on: ${this.name}`)
        );

        while (true) {
            try {
                const result = await redis.blPop(this.name, 0);

                if (!result || !result.element) continue;

                let job;
                try {
                    job = JSON.parse(result.element);
                } catch (err) {
                    console.error(this.colors.red(`[${this.now()}] ❌ Invalid JSON in job:`), err);
                    continue;
                }

                const queueName = job.event;
                if (!queueName || typeof queueName !== 'string') {
                    console.log(this.colors.yellow(`[${this.now()}] ⚠️ Invalid job format (missing event)`));
                    continue;
                }

                this.loadFolder(queueName);

                if (typeof this.queueHandler !== 'function') {
                    console.log(this.colors.yellow(`[${this.now()}] ⚠️ No valid handler for queue "${queueName}"`));
                    continue;
                }

                console.log(this.colors.cyan(`[${this.now()}] 🚀 Running job from queue: ${queueName}`));
                await this.queueHandler(job);
                console.log(this.colors.green(`[${this.now()}] ✅ Job from "${queueName}" done.`));
            } catch (err) {
                console.error(this.colors.red(`[${this.now()}] ❌ Error in queue processor:`), err);
                await new Promise((res) => setTimeout(res, 1000)); // Delay nhẹ để tránh crash liên tục
            }
        }
    }
};
