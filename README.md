# 📖 Telegram Bot Setup Guide

## 1. Yêu cầu hệ thống
- Node.js >= 18  
- Yarn hoặc npm  
- MySQL  
- Redis  
- pm2 (để quản lý tiến trình bot)  

---

## 2. Clone project & cài đặt
```bash
git clone <repo_url> tele-bot
cd tele-bot

# Cài thư viện
yarn
# hoặc
npm install
```

---

## 3. File cấu hình `.env`
Tạo file `.env` trong thư mục gốc:

```env
# Telegram
BOT_TOKEN=your_telegram_bot_token

# Database MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=telebot

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# App
APP_ENV=development
APP_PORT=3000
```

---

## 4. Chạy bot dev mode
```bash
yarn dev
```

---

## 5. Chạy queue xử lý job
```bash
npm run jobs/defaultQueue.js
```

---

## 6. Chạy bot bằng pm2
Cài pm2 nếu chưa có:
```bash
npm install -g pm2
```

Start bot:
```bash
pm2 start yarn --name telebot -- dev
```

Start queue worker:
```bash
pm2 start npm --name telebot-queue -- run jobs/defaultQueue.js
```

Xem danh sách process:
```bash
pm2 ls
```

Theo dõi log:
```bash
pm2 logs telebot
pm2 logs telebot-queue
```

---

## 7. Cấu hình MySQL
Tạo database:
```sql
CREATE DATABASE telebot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Import schema (nếu có):
```bash
mysql -u root -p telebot < schema.sql
```

---

## 8. Cấu hình Redis
Redis chạy mặc định ở `127.0.0.1:6379`.

Nếu có password, sửa `.env` với:
```env
REDIS_PASSWORD=yourpassword
```

Test kết nối:
```bash
redis-cli ping
```
Kết quả phải trả về:
```
PONG
```

---

✅ Sau khi setup xong:  
- Bot sẽ lắng nghe message từ Telegram.  
- Đẩy command vào Redis queue (`telegrambot_default_queue`).  
- Worker (`jobs/defaultQueue.js`) sẽ lấy job để xử lý.  
- pm2 giữ cho bot và worker luôn chạy ổn định.
