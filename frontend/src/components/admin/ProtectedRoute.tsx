import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import '../../css/admin.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      if (requireAdmin && userStr) {
        try {
          const user = JSON.parse(userStr);

          // ❗ Chỉ kiểm tra ROLE, không kiểm tra email nữa
          const hasAdminRole = user.role === 'admin';

          console.log("🔍 Admin role check:", {
            email: user.email,
            role: user.role,
            hasAdminRole
          });

          setIsAdmin(hasAdminRole);

        } catch (err) {
          console.error('Error parsing user data:', err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(true);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, [requireAdmin, location]);

  if (isAuthenticated === null) {
    return (
      <div className="protected-route-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang kiểm tra...</span>
        </div>
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location, message: 'Vui lòng đăng nhập để truy cập trang quản trị' }} 
        replace 
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
      <div className="protected-route-error">
        <h2>⚠️ Không có quyền truy cập</h2>
        <p>Tài khoản của bạn không có quyền Admin.</p>

        <div className="alert alert-info mt-3">
          <strong>Thông tin tài khoản hiện tại:</strong><br />
          <code>Email: {user.email || 'N/A'}, Role: {user.role || 'N/A'}</code>
        </div>

        <div className="mt-3">
          <button 
            className="btn btn-primary me-2"
            onClick={() => window.location.href = '/login'}
          >
            Đăng nhập lại
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.href = '/'}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
