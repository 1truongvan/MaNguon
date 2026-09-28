import React, { useEffect, useState } from 'react';
import './AdminOrder.css';

interface Order {
  _id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total_price: number;
  payment_method: string;
  created_at: string;
  status: string;
}

const AdminOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem("accessToken");
  
  const API_BASE_URL = 'https://manguon-2.onrender.com/api/Order';

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        fetchOrders();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchOrders = async () => {
    try {
      // Setup tìm kiếm
      const queryParam = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const url = `${API_BASE_URL}/admin/all${queryParam}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Gửi kèm Token để qua bảo mật
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        // Xử lý lỗi nếu token hết hạn
        if (res.status === 401 || res.status === 403) {
             console.error("Lỗi quyền truy cập! Vui lòng đăng nhập lại.");
        }
        throw new Error("Lỗi tải dữ liệu từ Server");
      }

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if(!window.confirm(`Xác nhận đổi trạng thái sang: ${newStatus}?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        alert("Cập nhật thành công!");
        fetchOrders(); // Load lại danh sách
      } else {
        alert("Lỗi cập nhật. Kiểm tra lại server.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  if (loading) return <div className="p-4">Đang tải danh sách đơn...</div>;

  return (
    <div className="admin-order-container">
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="page-title" style={{ margin: 0 }}>Quản lý Đơn hàng</h2>
        
        <input 
          type="text" 
          placeholder="🔍 Tìm mã đơn, tên khách..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            padding: '10px', 
            width: '300px', 
            borderRadius: '6px', 
            border: '1px solid #ccc',
            outline: 'none'
          }}
        />
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
                orders.map((order) => (
                <tr key={order._id}>
                    <td className="font-bold">#{order.order_number}</td>
                    <td>
                        <div className="customer-name" style={{fontWeight: 600}}>{order.customer_name}</div>
                        <div className="customer-phone" style={{fontSize: '0.9em', color: '#666'}}>{order.customer_phone}</div>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="text-red font-bold">{formatCurrency(order.total_price)}</td>
                    
                    <td>
                        <span className="badge-payment" style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            background: '#f0f0f0', 
                            fontSize: '12px' 
                        }}>
                            {order.payment_method}
                        </span>
                    </td>
                    
                    <td>
                    <select 
                        className={`status-select ${order.status}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="pending">Chờ xử lý</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="shipped">Đang giao hàng</option>
                        <option value="delivered">Đã giao thành công</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    </td>
                    
                    <td>
                    <button 
                        className="btn-view" 
                        onClick={() => alert(`Xem chi tiết đơn ${order.order_number}`)}
                        style={{ 
                            cursor: 'pointer', 
                            padding: '6px 12px', 
                            background: '#007bff', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '4px' 
                        }}
                    >
                        Xem
                    </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                        Không tìm thấy đơn hàng nào.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrder;