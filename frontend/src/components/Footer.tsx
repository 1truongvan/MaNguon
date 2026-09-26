// src/components/Footer.tsx
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="footer text-white pt-5 pb-4">
      <Container>
        <Row className="gy-4">
          <Col lg={3} md={6}>
            <h6 className="footer-title">ĐĂNG KÝ NHẬN TIN</h6>
            <p className="footer-text">Hãy là người đầu tiên nhận khuyến mãi lớn!</p>
            <Form className="d-flex">
              <Form.Control type="email" placeholder="Nhập email của bạn" className="me-2" />
              <Button variant="light" type="submit" className="text-nowrap">ĐĂNG KÝ</Button>
            </Form>
          </Col>
          <Col lg={3} md={6}>
            <h6 className="footer-title">HỖ TRỢ KHÁCH HÀNG</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Chính sách đổi hàng</a></li>
              <li><a href="#">Chính sách Membership</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Chính sách giao hàng</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h6 className="footer-title">HỆ THỐNG CỬA HÀNG</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="#"><strong>HỒ CHÍ MINH (11 CH)</strong></a></li>
              <li><a href="#"><strong>HÀ NỘI</strong></a></li>
              <li><a href="#"><strong>ĐỒNG NAI</strong></a></li>
              <li><a href="#">Xem tất cả cửa hàng</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h6 className="footer-title">FANPAGE</h6>
            <div className="bg-white" style={{ width: '100%', height: '130px', opacity: '0.1' }}></div>
          </Col>
        </Row>
        <hr className="mt-4 mb-3" />
        <p className="text-center footer-text m-0">© Bản quyền thuộc về Van truong</p>
      </Container>
    </footer>
  );
}

export default Footer;