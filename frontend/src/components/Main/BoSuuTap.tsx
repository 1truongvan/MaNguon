// src/components/CollectionsBootstrap.tsx
import { Container, Carousel, Row, Col } from 'react-bootstrap';

// --- Dữ liệu mẫu (6 ảnh) ---
import collection1 from '../../assets/collection-friends.jpg';
import collection2 from '../../assets/collection-procool.jpg';
import collection3 from '../../assets/collection-sundaze.jpg';
import collection4 from '../../assets/collection-sundaze2.jpg';
import collection5 from '../../assets/collection-sundaze3.jpg';
import collection6 from '../../assets/collection-sundaze4.jpg';

const collections = [
  { img: collection1, alt: 'Mickey & Friends', title: 'Mickey & Friends', subtitle: 'IN REAL LIFE 2025' },
  { img: collection2, alt: 'ProCOOL', title: 'ProCOOL New Gen', subtitle: 'MAX LẠNH PRO HƠN' },
  { img: collection3, alt: 'Sundaze Rush', title: 'BST Hè 2025', subtitle: 'SUNDAZE RUSH' },
  { img: collection4, alt: 'Retro', title: 'Retro Collection', subtitle: 'PHONG CÁCH CỔ ĐIỂN' },
  { img: collection5, alt: 'Denim', title: 'Denim Everyday', subtitle: 'NĂNG ĐỘNG MỖI NGÀY' },
  { img: collection6, alt: 'New Rules', title: 'The New Rules', subtitle: 'FALL COLLECTION 2025' }, 
];

function CollectionsBootstrap() {
  return (
    <Container as="section" className="py-4 text-center">
      <h2 className="section-title mb-4">Bộ Sưu Tập Mới Nhất</h2>

      <Carousel indicators={false} interval={null}>
        {/* === SLIDE 1 === */}
        <Carousel.Item>
          <Row>
            {collections.slice(0, 3).map((collection, index) => (
              <Col md={4} key={index} className="collection-item">
                {/* 1. Div này bây giờ chỉ chứa ảnh */}
                <div className="collection-image-wrapper">
                  <img
                    className="d-block w-100 rounded"
                    src={collection.img}
                    alt={collection.alt}
                  />
                </div>
                {/* 2. Div chứa chữ được đưa ra ngoài và đặt bên dưới */}
                <div className="collection-text-under">
                  <h6>{collection.title}</h6>
                  <h5>{collection.subtitle}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Carousel.Item>

        {/* === SLIDE 2 === */}
        <Carousel.Item>
          <Row>
            {collections.slice(3, 6).map((collection, index) => (
              <Col md={4} key={index} className="collection-item">
                <div className="collection-image-wrapper">
                  <img
                    className="d-block w-100 rounded"
                    src={collection.img}
                    alt={collection.alt}
                  />
                </div>
                <div className="collection-text-under">
                  <h6>{collection.title}</h6>
                  <h5>{collection.subtitle}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
}

export default CollectionsBootstrap;