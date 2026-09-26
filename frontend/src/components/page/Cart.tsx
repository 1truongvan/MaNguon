import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

import '../../css/cart.css';

interface CartItem {
  id: string;
  name: string;
  image: string | null;
  price: number;
  originalPrice: number;
  quantity: number;
  size?: string;
}

const getImage = (url: string | undefined | null) => {
  if (!url) return "/no-image.png";

  // CASE 1: Base64 đúng chuẩn
  if (url.startsWith("data:image")) {
    return url.replace(/\s/g, ""); // xoá khoảng trắng hoặc xuống dòng
  }

  // CASE 2: Ảnh backend /uploads
  if (url.includes("uploads")) {
    return "http://localhost:3000/" + url.replace(/\\/g, "/").replace("public/", "");
  }

  // CASE 3: Ảnh FE /src/assets
  if (url.includes("assets")) {
    try {
      const file = url.split("/assets/")[1];
      return new URL(`../../assets/${file}`, import.meta.url).href;
    } catch {
      return "/no-image.png";
    }
  }

  // CASE 4: URL đầy đủ
  if (url.startsWith("http")) return url;

  return "/no-image.png";
};

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener('focus', checkLoginStatus);
    return () => window.removeEventListener('focus', checkLoginStatus);
  }, [location]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get("http://localhost:3000/api/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("API CART RESPONSE:", res.data);
const mapped = res.data.map((item: any) => {
  let raw = item.product_id?.images?.[0] || null;
  let img = getImage(raw);

  // FIX: Nếu getImage trả ra URL die → đổi ngay tại đây
  if (!img || img.includes("undefined") || img.includes("null")) {
    img = "/no-image.png";
  }

  return {
    id: item._id,
    name: item.product_id?.name || "Không có tên",
    image: img, // -> luôn là URL không lỗi
    price: item.product_id?.price || 0,
    originalPrice: item.product_id?.originalPrice || 0,
    quantity: item.quantity,
  };
});


        setCartItems(mapped);
      } catch (error) {
        console.error("❌ Lỗi fetch cart:", error);
      }
    };

    fetchCart();
  }, []);

const removeItem = async (id: string) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn phải đăng nhập để xoá sản phẩm!");
      return;
    }

    // GỌI API XOÁ
    await axios.delete(`http://localhost:3000/api/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // XOÁ TRÊN FE
    setCartItems(prev => prev.filter(item => item.id !== id));

  } catch (err) {
    console.error("❌ Lỗi xoá sản phẩm:", err);
    alert("Không thể xoá sản phẩm. Thử lại!");
  }
};


  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(
      cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [showCouponForm, setShowCouponForm] = useState(false);

  const coupons: { [key: string]: number } = {
    'OCT100': 100000,
    'OCT200': 200000,
    'SAVE50': 50000
  };

  const applyCoupon = () => {
    if (coupons[couponCode]) {
      setAppliedCoupon(couponCode);
      setCouponCode('');
      setShowCouponForm(false);
    } else {
      alert('Mã coupon không hợp lệ!');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? coupons[appliedCoupon] : 0;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

const handleCheckout = () => {
  if (!isLoggedIn) {
    navigate('/login');  // bắt đăng nhập trước
    return;
  }

  navigate('/checkout'); // login rồi thì cho checkout
};

  if (cartItems.length === 0) {
    return <div className="text-center mt-5">Giỏ hàng trống</div>;
  }

  return (
    <div className="cart-page">
      <Container>
        <Row className="mt-5">
          <Col lg={8}>
            <div className="cart-header mb-4">
              <h2>🛒 Giỏ hàng</h2>
              <a href="#" className="sxp-link">Sắp xếp</a>
            </div>

            <div className="cart-items">
              {cartItems.map(item => (
                <Card key={item.id} className="cart-item mb-3">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs="auto">
<img src={item.image} alt={item.name} className="cart-img" />


                      </Col>

                      <Col>
                        <h6 className="mb-2">{item.name}</h6>
                        {item.size && <small className="text-muted">Size: {item.size}</small>}
                        <div className="mt-2">
                          <span className="price">{formatPrice(item.price)}</span>
                          <span className="original-price ms-2">{formatPrice(item.originalPrice)}</span>
                        </div>
                      </Col>

                      <Col xs="auto">
                        <Form.Group className="quantity-group">
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            −
                          </Button>
                          <Form.Control
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            min="1"
                            className="quantity-input"
                          />
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </Form.Group>
                      </Col>

                      <Col xs="auto">
                        <Button
                          variant="light"
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          <Col lg={4}>
            <Card className="order-summary sticky-top">
              <Card.Body>
                <h5 className="mb-3">Ưu Đãi Dành Cho Bạn</h5>

                <div className="coupon-section mb-3">
                  {!showCouponForm ? (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100"
                      onClick={() => setShowCouponForm(true)}
                    >
                      Bạn muốn chọn sản phẩm khác?
                    </Button>
                  ) : (
                    <Form className="coupon-form">
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Nhập mã Coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          size="sm"
                        />
                      </Form.Group>
                      <div className="d-flex gap-2 mt-2">
                        <Button variant="primary" size="sm" className="flex-grow-1" onClick={applyCoupon}>
                          Áp dụng
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setShowCouponForm(false)}>
                          Hủy
                        </Button>
                      </div>
                    </Form>
                  )}
                </div>

                <div className="discount-codes mb-3">
                  <div className="discount-badge">
                    <strong>OCT100</strong>
                    <small>Giảm 100.000đ</small>
                  </div>
                  <div className="discount-badge">
                    <strong>OCT200</strong>
                    <small>Giảm 200.000đ</small>
                  </div>
                </div>

                <hr />

                <div className="price-details">
                  <div className="price-row">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="price-row">
                    <span>Phí vận chuyển:</span>
                    <span className="free">0đ</span>
                  </div>
                  {appliedCoupon && (
                    <div className="price-row text-success">
                      <span>Voucher giảm giá:</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="total-row">
                    <span>Tổng:</span>
                    <span className="total-amount">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 mt-3"
                  onClick={handleCheckout}
                >
                  {isLoggedIn ? 'Thanh toán' : 'Đăng nhập để thanh toán'}
                </Button>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
