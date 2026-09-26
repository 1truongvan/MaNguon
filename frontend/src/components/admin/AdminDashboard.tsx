import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <Container fluid>
        <h2 className="mb-4">Trang chủ Admin</h2>
        
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>📦 Quản lý Sản phẩm</Card.Title>
                <Card.Text>
                  Thêm, sửa, xóa và quản lý tất cả sản phẩm trong hệ thống.
                </Card.Text>
                <Link to="/admin/products" className="btn btn-primary">
                  Quản lý Sản phẩm
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>📁 Quản lý Danh mục</Card.Title>
                <Card.Text>
                  Quản lý các danh mục sản phẩm và phân loại.
                </Card.Text>
                <Link to="/admin/categories" className="btn btn-primary">
                  Quản lý Danh mục
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>📝 Quản lý Bài viết</Card.Title>
                <Card.Text>
                  Quản lý các bài viết và nội dung trên website.
                </Card.Text>
                <Link to="/admin/posts" className="btn btn-primary">
                  Quản lý Bài viết
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>📦quản lí đơn hàng </Card.Title>
                <Card.Text>
                  Thêm, sửa, xóa và quản lý tất cả sản phẩm trong hệ thống.
                </Card.Text>
                <Link to="/admin/order" className="btn btn-primary">
                  Quản lý Sản phẩm
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>📁 Quản lý Danh mục</Card.Title>
                <Card.Text>
                  Quản lý các danh mục sản phẩm và phân loại.
                </Card.Text>
                <Link to="/admin/categories" className="btn btn-primary">
                  Quản lý Danh mục
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>📝 Quản lý Bài viết</Card.Title>
                <Card.Text>
                  Quản lý các bài viết và nội dung trên website.
                </Card.Text>
                <Link to="/admin/posts" className="btn btn-primary">
                  Quản lý Bài viết
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="g-4 mt-2">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>👥 Quản lý Người dùng</Card.Title>
                <Card.Text>
                  Xem, sửa và quản lý tất cả người dùng và quản trị viên trong hệ thống.
                </Card.Text>
                <Link to="/admin/users" className="btn btn-primary">
                  Quản lý Người dùng
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>🗄️ Database</Card.Title>
                <Card.Text>
                  Xem thông tin kết nối MongoDB và trạng thái database.
                </Card.Text>
                <Link to="/admin/database" className="btn btn-primary">
                  Xem Database
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;

