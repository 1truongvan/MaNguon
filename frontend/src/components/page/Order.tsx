// File: src/components/page/Order.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Order.css';

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface OrderItem {
  id: number | string;
  name: string;
  variant: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
}

interface OrderData {
  _id: string; // ID từ MongoDB
  orderCode?: string; // Mã đơn hàng ngắn gọn (nếu có)
  status: 'Pending' | 'Shipping' | 'Completed' | 'Cancelled';
  statusText?: string;
  createdAt: string; // Ngày tạo đơn
  customer: {
    name: string;
    phone: string;
    address: string;
    note: string;
  };
  paymentMethod: string;
  shippingMethod?: string;
  items: OrderItem[];
  costs: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
}

const Order: React.FC = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- 2. GỌI API ---
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Gọi API Backend (Sửa lại port nếu backend của bạn khác 3000)
        // Nếu có ID trên URL thì gọi API chi tiết, nếu không thì gọi lấy danh sách mẫu
        const url = id 
            ? `http://localhost:3000/api/Order/${id}`
            : `http://localhost:3000/api/Order/`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Không thể kết nối đến Server');
        }

        const data = await response.json();
        
        // Xử lý dữ liệu trả về (nếu là mảng thì lấy phần tử đầu, nếu là object thì lấy luôn)
        if (Array.isArray(data)) {
            if (data.length > 0) setOrder(data[0]);
            else setError("Chưa có đơn hàng nào");
        } else {
            setOrder(data);
        }

      } catch (err: any) {
        console.error(err);
        setError("Lỗi tải dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // --- 3. HÀM HỖ TRỢ HIỂN THỊ ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Shipping': return 'status-shipping';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  // --- 4. RENDER GIAO DIỆN ---
  if (loading) return <div className="loading-screen">Đang tải đơn hàng...</div>;
  if (error) return <div className="error-screen">{error}</div>;
  if (!order) return <div className="error-screen">Không tìm thấy thông tin đơn hàng</div>;

  return (
    <div className="order-page-container">
      {/* HEADER */}
      <div className="order-header">
        <div className="header-left">
          {/* Ưu tiên hiển thị orderCode, nếu không có thì hiện ID */}
          <h1 className="order-title">Chi tiết đơn hàng #{order.orderCode || order._id}</h1>
          <p className="order-date">Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
        </div>
        <div className={`order-status-badge ${getStatusColor(order.status)}`}>
          {order.statusText || order.status}
        </div>
      </div>

      <div className="order-content-grid">
        {/* LEFT COLUMN: THÔNG TIN */}
        <div className="order-left-col">
          
          <div className="info-card">
            <h3 className="card-title">Thông tin nhận hàng</h3>
            <div className="info-row">
              <span className="info-label">Người nhận:</span>
              <span className="info-value">{order.customer?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Số điện thoại:</span>
              <span className="info-value">{order.customer?.phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Địa chỉ:</span>
              <span className="info-value">{order.customer?.address}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ghi chú:</span>
              <span className="info-value note-text">{order.customer?.note || 'Không có'}</span>
            </div>
          </div>

          <div className="info-card">
            <h3 className="card-title">Thanh toán & Vận chuyển</h3>
            <div className="info-row">
              <span className="info-label">Thanh toán:</span>
              <span className="info-value">{order.paymentMethod}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Vận chuyển:</span>
              <span className="info-value">{order.shippingMethod || 'Tiêu chuẩn'}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SẢN PHẨM & TỔNG TIỀN */}
        <div className="order-right-col">
          
          <div className="info-card product-card">
            <h3 className="card-title">Sản phẩm ({order.items?.length || 0})</h3>
            <div className="product-list">
              {order.items?.map((item, index) => (
                <div key={index} className="product-item">
                  <div className="product-img-wrapper">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/80'} 
                    />
                    <span className="product-qty-badge">x{item.quantity}</span>
                  </div>
                  <div className="product-details">
                    <h4 className="product-name">{item.name}</h4>
                    <p className="product-variant">{item.variant}</p>
                    <div className="product-price-row">
                      <span className="current-price">{formatCurrency(item.price)}</span>
                      {item.originalPrice > item.price && (
                        <span className="original-price">{formatCurrency(item.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card summary-card">
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.costs?.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span className="text-green">{order.costs?.shipping === 0 ? 'Miễn phí' : formatCurrency(order.costs?.shipping)}</span>
            </div>
            <div className="summary-row">
              <span>Giảm giá</span>
              <span>-{formatCurrency(order.costs?.discount)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>Tổng cộng</span>
              <span className="total-amount">{formatCurrency(order.costs?.total)}</span>
            </div>
          </div>

          <div className="action-buttons">
             {order.status === 'Pending' && (
               <button className="btn btn-secondary">Hủy đơn hàng</button>
             )}
             <button className="btn btn-primary">Liên hệ hỗ trợ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;