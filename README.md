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
TELEGRAM_TOKEN=yout_token_here

# Database MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=khaizinam
DB_NAME=dev_telegram

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
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
pm2 start
```

Xem danh sách process:
```bash
pm2 ls
```

Theo dõi log:
```bash
pm2 logs app-dev
pm2 logs queue-default
```

Rebuild lại sau khi change code:
```bash
pm2 restart all
```

Stop PM2:
```bash
pm2 dell all
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

---

✅ Sau khi setup xong:  
- Bot sẽ lắng nghe message từ Telegram.  
- Đẩy command vào Redis queue (`telegrambot_default_queue`).  
- Worker (`jobs/defaultQueue.js`) sẽ lấy job để xử lý.  
- pm2 giữ cho bot và worker luôn chạy ổn định.
