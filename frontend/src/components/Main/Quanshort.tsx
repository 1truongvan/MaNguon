// src/components/ShortsSection.tsx
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard'; // Tái sử dụng component ProductCard

// --- Dữ liệu mẫu cho khu vực Quần Short ---
// 1. Import ảnh banner "QUẦN SHORT"
import shortsPromoBanner from '../../assets/quanshort-promo-banner.jpg'; // <-- Thay bằng ảnh của bạn

// 2. Import ảnh các sản phẩm quần short
import short1 from '../../assets/short-tactical.jpg';
import short2 from '../../assets/short-jean-dark.jpg';
import short3 from '../../assets/short-orgnis-loose.jpg';
import short4 from '../../assets/short-denim-hoa.jpg';

const shorts = [
  { imageUrl: short1, title: 'Quần Short Nam Tactical...', price: '349,000₫' },
  { imageUrl: short2, title: 'Quần Short Jean Nam Dark...', price: '350,000₫' },
  { imageUrl: short3, title: 'Quần Short Nam Orgnis Loose...', price: '419,000₫' },
  { imageUrl: short4, title: 'Quần Short Nam Denim Hoa...', price: '349,000₫' },
];

function Quanshort() {
  return (
    <Container as="section" className="py-3">
      {/* Thanh điều hướng lọc sản phẩm */}
      <div className="category-nav">
        <a href="#" className="active">Quần Short</a>
        <a href="#">Quần Jean</a>
        <a href="#">Quần Tây</a>
      </div>

      <Row>
        {/* Cột bên trái cho Banner quảng cáo */}
        <Col lg={3} className="d-none d-lg-block">
          <div className="category-promo-banner">
            <img src={shortsPromoBanner} alt="Quần Short Mới" className="img-fluid" />
            <div className="promo-content">
              <h2>QUẦN SHORT</h2>
              <Link to="/men-pants">
                <Button variant="light" size="sm">XEM NGAY</Button>
              </Link>
            </div>
          </div>
        </Col>

        {/* Cột bên phải cho lưới sản phẩm */}
        <Col lg={9}>
          <div className="product-carousel-wrapper">
            <Row xs={2} md={3} lg={4} className="g-3">
              {shorts.map((product, index) => (
                <Col key={index}>
                  <ProductCard {...product} />
                </Col>
              ))}
            </Row>
            {/* Nút điều hướng carousel (chỉ mang tính giao diện) */}
            <Button variant="light" className="carousel-nav-btn next-btn">›</Button>
          </div>
        </Col>
      </Row>

      {/* Nút "Xem tất cả" */}
      <div className="text-center mt-4">
        <Link to="/men-pants">
          <Button variant="outline-dark">Xem tất cả</Button>
        </Link>
      </div>
    </Container>
  );
}

export default Quanshort;