const path = require("path");
const bot = require("../../bot");
const _ = require("lodash");

const colors = {
  green: (msg) => `\x1b[32m${msg}\x1b[0m`,
  red: (msg) => `\x1b[31m${msg}\x1b[0m`,
  yellow: (msg) => `\x1b[33m${msg}\x1b[0m`,
};

function now() {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
}

module.exports = async function (job) {
  const { data } = job;
  text = _.get(data, 'text', null);
  if (!text || !text.startsWith("/")) {
    console.log(colors.yellow(`[${now()}] ⚠️ Invalid command job.`));
    return;
  }

  // get prefix from message
  // get prefix from message
  const parts = text.trim().split(" ");
  let cmdName = parts[0].substring(1);
  // Nếu có dấu @ thì chỉ lấy phần trước @ và check bot name
  if (cmdName.includes("@")) {
    const [cmd, botTag] = cmdName.split("@");
    // Lấy username bot thật từ bot instance
    const botInfo = await bot.getMe();
    console.log(botInfo);
    const myBotName = botInfo.username;
    console.log(myBotName);
    if (!myBotName) {
      console.warn(colors.yellow(`[${now()}] ⚠️ Bot username chưa được cấu hình.`));
    }
    if (botTag.toLowerCase() !== myBotName.toLowerCase()) {
      console.log(colors.yellow(`[${now()}] ⏭ Bỏ qua lệnh vì tag bot khác: @${botTag}`));
      return;
    }
    cmdName = cmd;
  }

  const args = parts.slice(1);
  try {
    // load command file.
    const commandPath = path.join(__dirname, `../../commands/${cmdName}.js`);
    const command = require(commandPath);
    // excute command.
    await command.handler(data, args, bot);
    console.log(colors.green(`[${now()}] ✅ Executed command: /${cmdName}`));
  } catch (err) {
    console.error(colors.red(`[${now()}] ❌ Error running /${cmdName}:`), err);
    // for send topc && chat group
    const opts = {};
    if (data?.is_topic_message) {
      opts.message_thread_id = msg.message_thread_id;
    }
    await bot.sendMessage(chatId, "❌ Có lỗi xảy ra khi xử lý lệnh.", opts);
  }
};
