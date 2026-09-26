import crypto from "crypto";
import https from "https";
import axios from "axios";
import Payment from "../models/payments.js";
import { VNPay } from "vnpay";
import Order from "../models/Order.js";
function generatePayID() {
    // Tạo ID thanh toán bao gồm cả giây để tránh trùng lặp
    const now = new Date();
    const timestamp = now.getTime();
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    return `PAY${timestamp}${seconds}${milliseconds}`;
}

export const createPayment = async (req, res) => {
  
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: "Tạo payment thất bại", error });
  }
};

// Lấy danh sách payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("user_id order_id");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Lấy danh sách thất bại", error });
  }
};

// Lấy payment theo ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("user_id order_id");
    if (!payment) return res.status(404).json({ message: "Payment không tồn tại" });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Lấy payment thất bại", error });
  }
};

// Cập nhật payment
export const updatePayment = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Payment không tồn tại" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Cập nhật thất bại", error });
  }
};

// Xoá payment
export const deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Payment không tồn tại" });
    res.status(200).json({ message: "Xoá payment thành công" });
  } catch (error) {
    res.status(500).json({ message: "Xoá thất bại", error });
  }
};


// =================================================================
// 🔥 MoMo ATM – payWithMethod (GIỮ NGUYÊN, CHỈ DỌN CODE CHO SẠCH)
// =================================================================

export const createMomoATM = async (req, res) => {
  try {
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const partnerCode = "MOMO";

    const amount = req.body.amount || "50000";
    const orderId = partnerCode + Date.now();
    const requestId = orderId;

    const orderInfo = "pay with MoMo ATM";
    const redirectUrl = "https://webhook.site/yourid"; 
    const ipnUrl = redirectUrl;
    const requestType = "payWithMethod";

    const rawSignature =
      `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}` +
      `&orderId=${orderId}&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: "vi",
      requestType,
      autoCapture: true,
      extraData: "",
      signature,
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const momoReq = https.request(options, (momoRes) => {
      let data = "";
      momoRes.on("data", chunk => data += chunk);
      momoRes.on("end", () => res.json(JSON.parse(data)));
    });

    momoReq.on("error", e => res.status(500).json({ message: "Lỗi MoMo ATM", error: e }));
    momoReq.write(requestBody);
    momoReq.end();

  } catch (error) {
    res.status(500).json({ message: "Lỗi server ATM MoMo", error });
  }
};



// =================================================================
// 🔥 MoMo Wallet – captureWallet (ĐÃ FIX ĐÚNG THEO VIDEO)
// =================================================================

export const createMomoPayment = async (req, res) => {
  try {
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

    const amount = req.body.amount || "50000";

    const requestId = partnerCode + Date.now();
    const orderId = requestId;
    const orderInfo = "Thanh toán bằng MOMO";

    const redirectUrl = "http://localhost:5173/payment-success";  
    const ipnUrl = "http://localhost:5000/payment/momo/ipn";       
    const extraData = "";
    const requestType = "captureWallet";

    // Tạo chữ ký
    const rawSignature =
      `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // Body gửi lên MoMo
    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    // Gọi MoMo API
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody
    );

    // TRẢ PAYURL ĐỂ FE REDIRECT
    return res.json({
      payUrl: response.data.payUrl,
    });

  } catch (error) {
    console.log("MOMO ERROR:", error.response?.data || error);
    return res.status(500).json({ message: "Payment error", error });
  }
};
// vn pay
// =================================================================
// 🔥 VNPay PAYMENT
// =================================================================


const ignoreLogger = () => {};

const vnpay = new VNPay({
    tmnCode: "TXE5RALY",
    secureSecret:"1GVQZAFVBQ0UO6M910G0H5WKUFVMIJFZ",
    vnpayHost: "https://sandbox.vnpayment.vn",
    testMode: true,
    hashAlgorithm: "SHA512",
    enableLog: true,
    loggerFn: ignoreLogger,
    endpoints: {
        paymentEndpoint: "paymentv2/vpcpay.html",
        queryDrRefundEndpoint: "merchant_webapi/api/transaction",
        getBankListEndpoint: "qrpayauth/api/merchant/get_bank_list",
    },
});

// =================================================================
// ⚡ API 1: Tạo URL thanh toán VNPay
// =================================================================

export const createVNPayPayment = async (req, res) => {
    try {
        console.log("📌 FULL BODY NHẬN TỪ FE:", req.body);
        console.log("📌 USER DECODE TỪ TOKEN:", req.user);

        // LẤY USER ID TỪ TOKEN
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Không tìm thấy user từ token" });
        }

        // LẤY ORDER ID TỪ FE
        const orderId = req.body.order_id;  // 🔥 DÙNG ORDER ID MONGO
        if (!orderId) {
            return res.status(400).json({ message: "Thiếu order_id từ FE" });
        }

        // Tạo transaction tạm
        const tempTransactionId = "TRANS_" + Date.now();

        const amount = req.body.amount || 100000;

        // LƯU PAYMENT GẮN VỚI ORDER THẬT
        const newPayment = await Payment.create({
            order_id: orderId,
            user_id: userId,
            transaction_id: tempTransactionId,
            amount,
            payment_date: "VNPAY",
            status: "pending"
        });

        console.log("🟢 Đã lưu Payment:", newPayment);

        // IP
        const ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            "127.0.0.1";

        // TẠO URL VNPAY
        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ipAddr,
            vnp_ReturnUrl: "http://localhost:3000/api/payments/vnpay/return",
            vnp_TxnRef: orderId, // 🔥 TRUYỀN ORDER ID THẬT LUÔN
            vnp_OrderInfo: `Thanh toán đơn hàng #${orderId}`,
        });

        return res.json({
            paymentUrl,
            orderId,
        });

    } catch (error) {
        console.log("🔥 VNPay ERROR:", error);
        return res.status(500).json({
            message: "VNPay error",
            error: error.message,
        });
    }
};



// =================================================================
// ⚡ API 2: VNPay Return – Xác thực khi người dùng thanh toán xong
// =================================================================

export const vnpayReturn = async (req, res) => {
    try {
        const verify = vnpay.verifyReturnUrl(req.query);

        const orderId = req.query.vnp_TxnRef;
        const vnpTransactionNo = req.query.vnp_TransactionNo;

        // TÌM PAYMENT
        const payment = await Payment.findOne({ order_id: orderId });

        if (!payment) {
            return res.status(404).json({
                message: "Không tìm thấy payment của đơn hàng",
            });
        }

        if (verify.isSuccess) {

            // 1) Update payment
            const updatedPayment = await Payment.findOneAndUpdate(
                { order_id: orderId },
                {
                    status: "success",
                    transaction_id: vnpTransactionNo,
                    payment_date: new Date(),
                },
                { new: true }
            );

            // 2) UPDATE ORDER — KHÔNG TẠO ORDER MỚI
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                {
                    status: "confirmed", // CHỌN STATUS ĐÚNG TRONG ENUM
                    payment_id: updatedPayment._id,
                },
                { new: true }
            );

            return res.json({
                status: "success",
                message: "Thanh toán thành công!",
                payment: updatedPayment,
                order: updatedOrder,
            });

        } else {
            await Payment.findOneAndUpdate(
                { order_id: orderId },
                { status: "failed" }
            );

            return res.json({
                status: "fail",
                message: "Thanh toán thất bại!",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi xác thực VNPay",
            error: error.message,
        });
    }
};
