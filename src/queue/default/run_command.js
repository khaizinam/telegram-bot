const path = require("path");
const bot = require("../../bot");

const colors = {
  green: (msg) => `\x1b[32m${msg}\x1b[0m`,
  red: (msg) => `\x1b[31m${msg}\x1b[0m`,
  yellow: (msg) => `\x1b[33m${msg}\x1b[0m`,
};

function now() {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
}

module.exports = async function (job) {
  const { chatId, text, user } = job;

  if (!text || !chatId || !user || !text.startsWith("/")) {
    console.log(colors.yellow(`[${now()}] ⚠️ Invalid command job.`));
    return;
  }

  const parts = text.trim().split(" ");
  const cmdName = parts[0].substring(1);
  const args = parts.slice(1);

  try {
    const commandPath = path.join(__dirname, `../../commands/${cmdName}.js`);
    const command = require(commandPath);

    const msg = {
      chat: { id: chatId },
      from: user,
      text,
    };

    await command.handler(msg, args, bot);
    console.log(colors.green(`[${now()}] ✅ Executed command: /${cmdName}`));
  } catch (err) {
    console.error(colors.red(`[${now()}] ❌ Error running /${cmdName}:`), err);
    await bot.sendMessage(chatId, "❌ Có lỗi xảy ra khi xử lý lệnh.");
  }
};
