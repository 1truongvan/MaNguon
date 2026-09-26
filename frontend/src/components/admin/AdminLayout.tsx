import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../../css/admin.css';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h2>Administrator</h2>
          <div className="admin-header-links">
            <Link to="/">Vào trang web</Link>
            <Link to="/admin/contact">Liên hệ</Link>
            <Link to="/admin/orders">Đơn hàng</Link>
          </div>
        </div>
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-content">
            <Link to="/admin" className="admin-sidebar-item">
              <span>🏠 Trang chủ Admin</span>
            </Link>

            <div className="admin-sidebar-section">
              <div className="admin-sidebar-section-title">Quản trị Danh mục</div>
              <Link 
                to="/admin/categories" 
                className={`admin-sidebar-item ${isActive('/admin/categories')}`}
              >
                <span>📁 Loại danh mục</span>
              </Link>
              <Link 
                to="/admin/products" 
                className={`admin-sidebar-item ${isActive('/admin/products')}`}
              >
                <span>📦 Sản phẩm</span>
              </Link>
              <Link 
                to="/admin/posts" 
                className={`admin-sidebar-item ${isActive('/admin/posts')}`}
              >
                <span>📝 Bài viết</span>
              </Link>
              <Link 
                to="/admin/posts" 
                className={`admin-sidebar-item1 ${isActive('/admin/posts')}`}
              >
                <span>📝 đơn hàng </span>
              </Link>
            </div>

            <div className="admin-sidebar-section">
              <div className="admin-sidebar-section-title">Quản trị giao diện</div>
            </div>

            <div className="admin-sidebar-section">
              <div className="admin-sidebar-section-title">Quản trị thông tin</div>
            </div>

            <div className="admin-sidebar-section">
              <div className="admin-sidebar-section-title">SEO Website</div>
            </div>

            <div className="admin-sidebar-section">
              <div className="admin-sidebar-section-title">Cấu Hình</div>
              <Link 
                to="/admin/users" 
                className={`admin-sidebar-item ${isActive('/admin/users')}`}
              >
                <span>👥 Quản lý Người dùng</span>
              </Link>
              <Link 
                to="/admin/database" 
                className={`admin-sidebar-item ${isActive('/admin/database')}`}
              >
                <span>🗄️ Database</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

