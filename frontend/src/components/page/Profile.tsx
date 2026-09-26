import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import tokenManager from '../../utils/tokenManager';
import PersonalInfo from './profile/PersonalInfo';
import ContactInfo from './profile/ContactInfo';
import ShippingAddresses from './profile/ShippingAddresses';
import PaymentMethods from './profile/PaymentMethods';
import OrderHistory from './profile/OrderHistory';
import MembershipLevel from './profile/MembershipLevel';
import AccountSettings from './profile/AccountSettings';

interface ShippingAddress {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  ward?: string;
  district?: string;
  province?: string;
  isDefault?: boolean;
  note?: string;
}

interface PaymentMethod {
  _id?: string;
  type: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  phone?: string;
  isDefault?: boolean;
}

interface PrivacySettings {
  showEmail?: boolean;
  showPhone?: boolean;
  allowMarketing?: boolean;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  gender?: string;
  dateOfBirth?: string;
  role: string;
  shippingAddresses?: ShippingAddress[];
  paymentMethods?: PaymentMethod[];
  membershipLevel?: string;
  membershipPoints?: number;
  language?: string;
  privacySettings?: PrivacySettings;
  created_at?: string;
  last_login_at?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('personal');

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const tryRefreshIfNeeded = async (maybeToken: string | null) => {
      if (!maybeToken) return false;
      try {
        if (tokenManager.isTokenExpired(maybeToken)) {
          // Thử refresh (server phải có route /api/auth/refresh)
          const r = await axios.post(
            '/api/auth/refresh',
            {},
            { withCredentials: true } // nếu refresh token lưu cookie httpOnly
          );
          if (r.status === 200 && r.data?.accessToken) {
            // Cập nhật access token (refresh token có thể vẫn nằm trong cookie)
            tokenManager.setTokens(r.data.accessToken, tokenManager.getRefreshToken() ?? '');
            return true;
          } else {
            tokenManager.clearTokens();
            return false;
          }
        }
        return true;
      } catch (refreshErr) {
        console.warn('Refresh token failed:', refreshErr);
        tokenManager.clearTokens();
        return false;
      }
    };

    const fetchUserProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = tokenManager.getAccessToken();
        if (!token) {
          tokenManager.clearTokens();
          navigate('/login');
          return;
        }

        const ok = await tryRefreshIfNeeded(token);
        if (!ok) {
          navigate('/login');
          return;
        }

        const currentToken = tokenManager.getAccessToken();
        if (!currentToken) {
          navigate('/login');
          return;
        }

        // Gọi API — dùng đường dẫn tương đối để tránh hardcode origin
        const res = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${currentToken}` },
          signal: controller.signal,
        });

        // backend có thể trả { user: {...} } hoặc trả trực tiếp object user
        const receivedUser = res.data?.user ?? res.data;
        if (!receivedUser) {
          if (!isMounted) return;
          setError('Không có dữ liệu người dùng từ server');
          setUser(null);
          setLoading(false);
          return;
        }

        if (isMounted) {
          setUser(receivedUser);
          setError('');
          setLoading(false);
        }
      } catch (err: any) {
        if (axios.isCancel(err)) {
          // request bị hủy do unmount
          return;
        }
        console.error('Error fetching profile:', err);
        if (!isMounted) return;
        setError('Không thể tải thông tin người dùng');
        setLoading(false);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          tokenManager.clearTokens();
          navigate('/login');
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [navigate]);

  const refreshUser = async () => {
    try {
      const token = tokenManager.getAccessToken();
      if (!token) return;

      if (tokenManager.isTokenExpired(token)) {
        try {
          const r = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
          if (r.status === 200 && r.data?.accessToken) {
            tokenManager.setTokens(r.data.accessToken, tokenManager.getRefreshToken() ?? '');
          } else {
            tokenManager.clearTokens();
            navigate('/login');
            return;
          }
        } catch {
          tokenManager.clearTokens();
          navigate('/login');
          return;
        }
      }

      const currentToken = tokenManager.getAccessToken();
      if (!currentToken) return;

      const res = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      const receivedUser = res.data?.user ?? res.data;
      setUser(receivedUser);
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Không tìm thấy thông tin người dùng</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Hồ sơ của tôi</h2>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'personal')}
        className="mb-4"
      >
        <Tab eventKey="personal" title="Thông tin cá nhân">
          <PersonalInfo user={user} onUpdate={refreshUser} />
        </Tab>

        <Tab eventKey="contact" title="Thông tin liên hệ">
          <ContactInfo user={user} onUpdate={refreshUser} />
        </Tab>

        <Tab eventKey="shipping" title="Địa chỉ nhận hàng">
          <ShippingAddresses user={user} onUpdate={refreshUser} />
        </Tab>

        <Tab eventKey="payment" title="Thanh toán">
          <PaymentMethods user={user} onUpdate={refreshUser} />
        </Tab>

        <Tab eventKey="orders" title="Lịch sử mua sắm">
          <OrderHistory />
        </Tab>

        <Tab eventKey="membership" title="Cấp độ thành viên">
          <MembershipLevel user={user} />
        </Tab>

        <Tab eventKey="settings" title="Thiết lập tài khoản">
          <AccountSettings user={user} onUpdate={refreshUser} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;
