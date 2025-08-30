module.exports = {
  apps: [
    {
      name: "app-dev",
      script: "npm",
      args: "run dev",
      watch: false,
      out_file: "./logs/pm2/app-dev-out.log",
      error_file: "./logs/pm2/app-dev-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
    {
      name: "queue-default",
      script: "jobs/defaultQueue.js",
      interpreter: "node",
      watch: false,
      autorestart: true,
      out_file: "./logs/pm2/queue-default-out.log",
      error_file: "./logs/pm2/queue-default-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
    {
      name: "get_coin-job",
      script: "jobs/get_coin.js",
      interpreter: "node",
      watch: false,
      autorestart: true,
      out_file: "./logs/pm2/get_coin-job-out.log",
      error_file: "./logs/pm2/get_coin-job-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
