import React, { useState, useEffect } from "react";
import "../../assets/css/checkout.css";
import axios from "axios";
import momo from "../../assets/icon/Payment By Momo.png";
import vvnpay from "../../assets/icon/Payment By ATM.png";
import { useNavigate, useLocation } from "react-router-dom";

interface CartItem {
  _id: string;
  quantity: number;
  product_id: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  } | null;
}

interface Province {
  code: number;
  name: string;
}
interface District {
  code: number;
  name: string;
}
interface Ward {
  code: number;
  name: string;
}

// 🟩 GIỮ NGUYÊN HÀM XỬ LÝ HÌNH ẢNH CỦA BẠN
const getImage = (url: string | undefined | null) => {
  if (!url) return "/no-image.png";

  if (url.startsWith("data:image")) {
    return url.replace(/\s/g, "");
  }

  if (url.includes("uploads")) {
    return "http://localhost:3000/" + url.replace(/\\/g, "/").replace("public/", "");
  }

  if (url.includes("assets")) {
    try {
      const file = url.split("/assets/")[1];
      return new URL(`../../assets/${file}`, import.meta.url).href;
    } catch {
      return "/no-image.png";
    }
  }

  if (url.startsWith("http")) return url;

  return "/no-image.png";
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🟩 NHẬN BUY NOW TỪ PRODUCT DETAIL
  const buyNowItem = location.state?.product || null;

  const [payment, setPayment] = useState("COD");
  const [voucher, setVoucher] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // -------------------- Lấy dữ liệu giỏ hàng --------------------
  useEffect(() => {
    // Nếu là mua ngay → KHÔNG FETCH GIỎ HÀNG
    if (buyNowItem) {
      setSubtotal(buyNowItem.price * buyNowItem.quantity);
      return;
    }

    const token = localStorage.getItem("accessToken");
    axios
      .get("http://localhost:3000/api/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const valid = res.data.filter((item: CartItem) => item.product_id !== null);
        setCart(valid);

        const total = valid.reduce(
          (sum: number, item: CartItem) =>
            sum + item.product_id!.price * item.quantity,
          0
        );
        setSubtotal(total);
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // -------------------- Load tỉnh thành --------------------
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  const handleProvinceChange = (code: string) => {
    setSelectedProvince(code);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);

    fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts));
  };

  const handleDistrictChange = (code: string) => {
    setSelectedDistrict(code);
    setSelectedWard("");
    setWards([]);

    fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards));
  };

  // -------------------- Tạo đơn hàng --------------------
const handlePayment = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return alert("Bạn chưa đăng nhập!");

  if (!customerName || !customerPhone || !address || !selectedWard)
    return alert("Vui lòng nhập đầy đủ thông tin giao hàng!");

  const itemsToOrder = buyNowItem
    ? [{
        product_id: buyNowItem._id,
        name: buyNowItem.name,
        price: buyNowItem.price,
        quantity: buyNowItem.quantity,
        image: buyNowItem.images?.[0],
      }]
    : cart.map((item) => ({
        product_id: item.product_id!._id,
        name: item.product_id!.name,
        price: item.product_id!.price,
        quantity: item.quantity,
        image: item.product_id!.images[0],
      }));

  // 🔥 1. TẠO ORDER TRƯỚC
  const orderRes = await axios.post(
    "http://localhost:3000/api/order/",
    {
      customer_name: customerName,
      customer_phone: customerPhone,
      shipping_address: address,
      shipping_ward: selectedWard,
      shipping_district: selectedDistrict,
      shipping_province: selectedProvince,
      note,
      payment_method: payment,
      items: itemsToOrder,
      subtotal,
      shipping_fee: 0,
      discount: 0,
      total_price: subtotal,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const orderId = orderRes.data.order._id; // 🔥 LẤY ORDER ID

  // -------------------------------------------------------
  // 🔥 2. CHUYỂN QUA THANH TOÁN
  // -------------------------------------------------------

  if (payment === "VNPAY") {
    const res = await axios.post(
      "http://localhost:3000/api/payments/vnpay/create",
      {
        amount: subtotal,
        paymentCode: "VNPAY",
        order_id: orderId, // 🔥 BẮT BUỘC
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.href = res.data.paymentUrl;
    return;
  }

  if (payment === "MOMO") {
    const res = await axios.post(
      "http://localhost:3000/api/payments/momo",
      {
        amount: subtotal,
        paymentCode: "MOMO",
        order_id: orderId, // 🔥 BẮT BUỘC
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.href = res.data.payUrl;
    return;
  }

  // -------------------------------------------------------
  // 🔥 3. COD → Xóa giỏ
  // -------------------------------------------------------

  alert("Đặt hàng thành công!");
  if (!buyNowItem) {
    await axios.delete("http://localhost:3000/api/cart/clear/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  navigate("/");
};


  return (
    <div className="checkout-container">

      {/* LEFT */}
      <div className="checkout-left">
        <h3>Thông tin đơn hàng</h3>

        <div className="form-group">
          <input type="text" placeholder="Họ và tên"
            value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

          <input type="text" placeholder="Số điện thoại"
            value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />

          <input type="text" placeholder="Địa chỉ"
            value={address} onChange={(e) => setAddress(e.target.value)} />

          {/* tỉnh / huyện / xã */}
          <select value={selectedProvince} onChange={(e) => handleProvinceChange(e.target.value)}>
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>

          <select value={selectedDistrict} onChange={(e) => handleDistrictChange(e.target.value)}>
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>

          <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
            <option value="">Chọn Phường/Xã</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>{w.name}</option>
            ))}
          </select>

          <textarea placeholder="Ghi chú"
            value={note} onChange={(e) => setNote(e.target.value)}></textarea>
        </div>

        {/* PAYMENT */}
        <h3>Hình thức thanh toán</h3>
        <div className="payment-box">
          <label className="pay-option">
            <input type="radio" checked={payment === "COD"} onChange={() => setPayment("COD")} />
            <span>COD – Thanh toán khi nhận hàng</span>
          </label>

          <label className="pay-option">
            <input type="radio" checked={payment === "VNPAY"} onChange={() => setPayment("VNPAY")} />
            <img src={vvnpay} /><span>Thanh toán VNPay</span>
          </label>

          <label className="pay-option">
            <input type="radio" checked={payment === "MOMO"} onChange={() => setPayment("MOMO")} />
            <img src={momo} /><span>Thanh toán MoMo</span>
          </label>
          <label className="pay-option">
  <input type="radio" checked={payment === "ATM"} onChange={() => setPayment("ATM")} />
  <img src={vvnpay} alt="MoMo ATM" /><span>Thanh toán MoMo ATM</span>
</label>
        </div>
      </div>

      {/* RIGHT */}
      <div className="checkout-right">
        <h3>Giỏ hàng</h3>

        {/* 🟩 BUY NOW → chỉ hiện 1 sản phẩm */}
        {buyNowItem ? (
          <div className="cart-item">
            <img src={getImage(buyNowItem.images?.[0])} alt="" />

            <div className="item-info">
              <p>{buyNowItem.name}</p>
              <p>SL: {buyNowItem.quantity}</p>
              <p className="price">
                {(buyNowItem.price * buyNowItem.quantity).toLocaleString()}₫
              </p>
            </div>
          </div>
        ) : (
          <>
            {cart.length === 0 ? (
              <p>Giỏ hàng trống...</p>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item._id}>
                  <img src={getImage(item.product_id?.images?.[0])} />

                  <div className="item-info">
                    <p>{item.product_id!.name}</p>
                    <p>SL: {item.quantity}</p>
                    <p className="price">
                      {(item.product_id!.price * item.quantity).toLocaleString()}₫
                    </p>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* VOUCHER */}
        <div className="voucher-box">
          <input type="text" placeholder="Nhập mã giảm giá"
            value={voucher} onChange={(e) => setVoucher(e.target.value)} />
          <button className="apply-btn">Áp dụng</button>
        </div>

        {/* SUMMARY */}
        <div className="summary">
          <div><span>Tạm tính</span><span>{subtotal.toLocaleString()}₫</span></div>
          <div><span>Phí ship</span><span>Miễn phí</span></div>
          <div><span>Giảm giá</span><span>0₫</span></div>
          <div className="total">
            <span>Tổng cộng</span>
            <span>{subtotal.toLocaleString()}₫</span>
          </div>
        </div>

        <button className="btn-pay" onClick={handlePayment}>
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Checkout;