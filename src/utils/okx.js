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
  return await okxRequest("GET", path);
}

// Lấy số dư TON trong ví (spot)
async function getBalance(ccy = "TON") {
  const path = `/api/v5/account/balance?ccy=${ccy}`;
  const data = await okxRequest("GET", path);
  try {
    const balance = data.data[0].details.find((d) => d.ccy === ccy);
    return {
      available: balance.availBal,
      total: balance.cashBal,
    };
  } catch (err) {
    console.error("Không lấy được số dư:", data);
    return null;
  }
}

// Đặt lệnh mua (limit/market)
async function buyTON(sz = "1", price = null) {
  const order = {
    instId: "TON-USDT",
    tdMode: "cash",
    side: "buy",
    ordType: price ? "limit" : "market",
    sz: sz,
  };
  if (price) order.px = price;

  return await okxRequest("POST", "/api/v5/trade/order", order);
}

// Đặt lệnh bán (limit/market)
async function sellTON(sz = "1", price = null) {
  const order = {
    instId: "TON-USDT",
    tdMode: "cash",
    side: "sell",
    ordType: price ? "limit" : "market",
    sz: sz,
  };
  if (price) order.px = price;

  return await okxRequest("POST", "/api/v5/trade/order", order);
}

// Đặt lệnh bán toàn bộ TON hiện có (market)
async function sellAllTON() {
  const bal = await getBalance("TON");
  if (!bal) return;

  const sz = bal.available;
  if (parseFloat(sz) <= 0) {
    console.log("Không có TON để bán.");
    return;
  }

  return await sellTON(sz);
}

// Lấy danh sách lệnh đang mở (chưa khớp hết)
async function getOpenOrders(instId = "TON-USDT") {
  const path = `/api/v5/trade/orders-pending?instId=${instId}`;
  return await okxRequest("GET", path);
}

// Hủy 1 lệnh theo orderId
async function cancelOrder(orderId, instId = "TON-USDT") {
  const body = {
    instId: instId,
    ordId: orderId,
  };
  return await okxRequest("POST", "/api/v5/trade/cancel-order", body);
}

// Hủy tất cả lệnh chưa khớp của 1 cặp
async function cancelAllOrders(instId = "TON-USDT") {
  const orders = await getOpenOrders(instId);
  if (!orders.data || orders.data.length === 0) {
    console.log("Không có lệnh nào để hủy.");
    return;
  }

  const results = [];
  for (const order of orders.data) {
    const res = await cancelOrder(order.ordId, instId);
    results.push(res);
  }
  return results;
}

module.exports = {
  sign,
  okxRequest,
  getPrice,
  getBalance,
  buyTON,
  sellTON,
  sellAllTON,
  getOpenOrders,
  cancelOrder,
  cancelAllOrders,
  formatPrice: function (price) {
    try {
      const num = Number(price);
      if (isNaN(num)) {
        return price;
      }
      return num.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
    } catch (e) {
      console.error("formatPrice error:", e);
      return price;
    }
  },
  getTimeNow: function (){
    return new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  },
  convertToVND: function (price) {
    try {
      const num = Number(price);
      if (isNaN(num)) return price;
      return (num * 25000).toLocaleString("vi-VN", { maximumFractionDigits: 0 });
    } catch (e) {
      return price;
    }
  }
};
