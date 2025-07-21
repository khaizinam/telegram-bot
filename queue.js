require("dotenv").config();
const fs = require("fs");
const path = require("path");
const redis = require("./src/redis");

const colors = {
    green: (msg) => `\x1b[32m${msg}\x1b[0m`,
    red: (msg) => `\x1b[31m${msg}\x1b[0m`,
    yellow: (msg) => `\x1b[33m${msg}\x1b[0m`,
    cyan: (msg) => `\x1b[36m${msg}\x1b[0m`,
};

function now() {
    return new Date().toISOString().replace("T", " ").substring(0, 19);
}

// 🧠 Load all queue handlers automatically
const queueHandlers = {};
const queueDir = path.join(__dirname, "src/queue");

fs.readdirSync(queueDir)
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
        const name = path.basename(file, ".js");
        queueHandlers[name] = require(path.join(queueDir, file));
    });

const queueNames = Object.keys(queueHandlers).map((name) => `${name}_queue`);
console.log(queueNames);

async function processQueue() {
    console.log(
        colors.cyan(
            `[${now()}] 🧵 Queue worker started... Listening on: ${queueNames.join(
                ", "
            )}`
        )
    );

    while (true) {
        try {
            const result = await redis.blPop(queueNames, 0);
            if (!result || !result.element) continue;

            const queueName = result.key.replace("_queue", "");
            const job = JSON.parse(result.element);

            const handler = queueHandlers[queueName];

            if (!handler) {
                console.log(
                colors.yellow(
                    `[${now()}] ⚠️ No handler found for queue "${queueName}"`
                )
                );
                continue;
            }

            console.log(
                colors.cyan(`[${now()}] 🚀 Running job from queue: ${queueName}`)
            );

            await handler(job);

            console.log(colors.green(`[${now()}] ✅ Job from "${queueName}" done.`));
        } catch (err) {
            console.error(colors.red(`[${now()}] ❌ Error in queue processor:`), err);
            await new Promise((res) => setTimeout(res, 1000));
        }
    }
}

processQueue();
