import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

interface MongoDBInfo {
  status: string;
  state: string;
  isConnected: boolean;
  database: {
    name: string;
    host: string;
    port: string | number;
    collectionsCount: number;
    collections: string[];
  };
  connectionString: string;
  timestamp: string;
}

interface HealthCheck {
  healthy: boolean;
  status: string;
  message: string;
  timestamp?: string;
}

const AdminDatabase: React.FC = () => {
  const [dbInfo, setDbInfo] = useState<MongoDBInfo | null>(null);
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = 'http://localhost:3000/api/admin';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchDatabaseInfo = React.useCallback(async () => {
    try {
      setError('');
      const [infoRes, healthRes] = await Promise.all([
        axios.get(`${API_URL}/mongodb/info`, getAuthHeaders()),
        axios.get(`${API_URL}/mongodb/health`, getAuthHeaders())
      ]);
      
      setDbInfo(infoRes.data);
      setHealth(healthRes.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Không thể lấy thông tin database');
      console.error('Error fetching database info:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDatabaseInfo();
  }, [fetchDatabaseInfo]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDatabaseInfo();
  };

  const getStatusBadge = (isConnected: boolean) => {
    return isConnected ? (
      <Badge bg="success">Đã kết nối</Badge>
    ) : (
      <Badge bg="danger">Chưa kết nối</Badge>
    );
  };

  const getHealthBadge = (healthy: boolean) => {
    return healthy ? (
      <Badge bg="success">Khỏe mạnh</Badge>
    ) : (
      <Badge bg="danger">Lỗi</Badge>
    );
  };

  if (loading) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="mt-3">Đang tải thông tin database...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="admin-database">
      <Container fluid>
        {/* Breadcrumbs */}
        <nav className="admin-breadcrumbs">
          <span>Trang chủ</span> / <span>Cấu hình</span> / <span>Database</span>
        </nav>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Thông tin MongoDB</h2>
          <Button variant="primary" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang làm mới...
              </>
            ) : (
              '🔄 Làm mới'
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {health && (
          <Card className={`mb-4 ${health.healthy ? 'border-success' : 'border-danger'}`}>
            <Card.Header className={`d-flex justify-content-between align-items-center ${health.healthy ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
              <h5 className="mb-0">🔍 Trạng thái Health Check</h5>
              {getHealthBadge(health.healthy)}
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Trạng thái:</strong> 
                    <Badge bg={health.healthy ? 'success' : 'danger'} className="ms-2">
                      {health.status}
                    </Badge>
                  </p>
                  <p><strong>Thông báo:</strong> {health.message}</p>
                </div>
                <div className="col-md-6">
                  {health.timestamp && (
                    <p className="text-muted small">
                      <strong>Kiểm tra lúc:</strong><br />
                      {new Date(health.timestamp).toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {dbInfo && (
          <>
            <Card className={`mb-4 ${dbInfo.isConnected ? 'border-success' : 'border-danger'}`}>
              <Card.Header className={`d-flex justify-content-between align-items-center ${dbInfo.isConnected ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                <h5 className="mb-0">🔌 Thông tin kết nối MongoDB</h5>
                {getStatusBadge(dbInfo.isConnected)}
              </Card.Header>
              <Card.Body>
                {!dbInfo.isConnected && (
                  <Alert variant="warning" className="mb-3">
                    <strong>⚠️ Cảnh báo:</strong> MongoDB chưa kết nối. Vui lòng kiểm tra:
                    <ul className="mb-0 mt-2">
                      <li>MONGO_URI trong file .env có đúng không?</li>
                      <li>MongoDB server có đang chạy không?</li>
                      <li>Network connection có ổn định không?</li>
                    </ul>
                  </Alert>
                )}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <p>
                      <strong>Trạng thái kết nối:</strong> 
                      <Badge bg={dbInfo.isConnected ? 'success' : 'danger'} className="ms-2">
                        {dbInfo.state}
                      </Badge>
                    </p>
                    <p><strong>📊 Database Name:</strong> <code>{dbInfo.database.name}</code></p>
                    <p><strong>🌐 Host:</strong> <code>{dbInfo.database.host}</code></p>
                    <p><strong>🔌 Port:</strong> <code>{dbInfo.database.port}</code></p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <p><strong>🔗 Connection String:</strong></p>
                    <code className="database-connection-string">
                      {dbInfo.connectionString}
                    </code>
                    <p className="text-muted small mt-2">
                      <em>🔒 Lưu ý: Thông tin đăng nhập đã được ẩn vì lý do bảo mật</em>
                    </p>
                  </div>
                </div>
                {dbInfo.timestamp && (
                  <div className="mt-3 pt-3 border-top">
                    <p className="text-muted small mb-0">
                      <strong>🕐 Cập nhật lúc:</strong> {new Date(dbInfo.timestamp).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {dbInfo.isConnected && (
              <Card>
                <Card.Header className="bg-info bg-opacity-10">
                  <h5 className="mb-0">📚 Collections trong Database</h5>
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Tổng số collections:</strong> 
                    <Badge bg="info" className="ms-2" style={{ fontSize: '1rem' }}>
                      {dbInfo.database.collectionsCount}
                    </Badge>
                  </p>
                  {dbInfo.database.collections.length > 0 ? (
                    <div className="mt-3">
                      <h6>Danh sách collections:</h6>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {dbInfo.database.collections.map((collection, index) => (
                          <Badge key={index} bg="info" style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}>
                            📄 {collection}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Alert variant="info" className="mt-3">
                      Không có collections nào trong database
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default AdminDatabase;

