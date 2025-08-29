const crypto = require("crypto");
const axios = require("axios");
 
const baseUrl = "https://www.okx.com";

// Hàm ký
function sign(message) {
  return crypto
    .createHmac("sha256", process.env.OKX_SECRET)
    .update(message)
    .digest("base64");
}

// Hàm gọi API
async function okxRequest(method, path, body = "") {
  const timestamp = new Date().toISOString();
  const bodyStr = body ? JSON.stringify(body) : ""; // JSON.stringify khi có body
  const message = timestamp + method.toUpperCase() + path + bodyStr;
  const signature = sign(message);

  const headers = {
    "OK-ACCESS-KEY": process.env.OKX_API_KEY,
    "OK-ACCESS-SIGN": signature,
    "OK-ACCESS-TIMESTAMP": timestamp,
    "OK-ACCESS-PASSPHRASE": process.env.OKX_PASS,
    "Content-Type": "application/json",
  };

  const url = baseUrl + path;
  const res = await axios({
    method,
    url,
    headers,
    data: bodyStr || undefined,
  });

  return res.data;
}

// Lấy giá hiện tại
async function getPrice(id = "TON-USDT") {
  const path = `/api/v5/market/ticker?instId=${id}`;
  const data = await okxRequest("GET", path);
  return data;
}

// Đặt lệnh mua
async function placeOrder() {
  const order = {
    instId: "TON-USDT", // Cặp giao dịch
    tdMode: "cash",     // "cross" hoặc "isolated" cho futures/margin
    side: "buy",        // buy hoặc sell
    ordType: "limit",   // limit hoặc market
    px: "4.5",          // giá đặt mua
    sz: "1",            // số lượng
  };

  const data = await okxRequest("POST", "/api/v5/trade/order", order);
  console.log("Kết quả đặt lệnh:", data);
}

module.exports = { sign, okxRequest, getPrice, placeOrder };
