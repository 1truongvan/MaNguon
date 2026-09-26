// src/components/NewArrivals.tsx

import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';

// 1. Import ảnh banner mới của bạn
import collectionBanner from '../../assets/retro-sports-banner.jpg'; 

// Thay thế bằng đường dẫn ảnh sản phẩm của bạn
import tshirt from '../../assets/product-tshirt.jpg';
import short from '../../assets/product-short.jpg';
import shirt from '../../assets/product-shirt.jpg';
import hat from '../../assets/product-hat.jpg';
import boxer from '../../assets/product-boxer.jpg';

const products = [
  { imageUrl: tshirt, title: 'Áo Thun Nam Họa Tiết...', price: '299,000₫' },
  { imageUrl: short, title: 'Quần Short Nam Tactical...', price: '349,000₫' },
  { imageUrl: shirt, title: 'Áo Sơ Mi Tay Dài Nam...', price: '349,000₫' },
  { imageUrl: hat, title: 'Nón Lưỡi Trai Nam...', price: '249,000₫' },
  { imageUrl: boxer, title: 'Quần Boxer Nam...', price: '100,000₫' },
];

function NewArrivals() {
  return (
    
<Container as="section" className="py-2 dark-section">
      
      {/* 2. Thêm thẻ <img> cho banner ở đây và xóa nút "XEM NGAY" cũ */}
      <img 
        src={collectionBanner} 
        alt="Retro Sports Collection Banner" 
        className="img-fluid" // Thêm mb-4 để tạo khoảng cách
      />

      {/* 3. Giữ nguyên phần hiển thị sản phẩm */}
      <Container className="mt-4"></Container>
      <Row xs={2} md={3} lg={5} className="g-3">
        {products.map((product, index) => (
          <Col key={index}>
            <ProductCard {...product} />
          </Col>
        ))}
      </Row>

      <div className="text-center mt-4">
        <Link to="/new">
          <Button variant="outline-dark">Xem tất cả</Button>
        </Link>
      </div>
    </Container>
  );
}

export default NewArrivals;