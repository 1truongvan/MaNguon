// src/components/InstagramFeed.tsx
import { Container, Row, Col } from 'react-bootstrap';

// Thay thế bằng ảnh của bạn
import insta1 from '../../assets/insta-1.jpg';
import insta2 from '../../assets/insta-2.jpg';
import insta3 from '../../assets/insta-3.jpg';
import insta4 from '../../assets/insta-4.jpg';
import insta5 from '../../assets/insta-5.jpg';

function InstagramFeed() {
  return (
    <Container as="section" className="py-3 text-center">
      <h2 className="section-title">Follow Instagram @ICONDENIM</h2>
      <Row className="g-2 mt-4">
        <Col><img src={insta1} className="img-fluid" alt="Instagram Post" /></Col>
        <Col><img src={insta2} className="img-fluid" alt="Instagram Post" /></Col>
        <Col><img src={insta3} className="img-fluid" alt="Instagram Post" /></Col>
        <Col><img src={insta4} className="img-fluid" alt="Instagram Post" /></Col>
        <Col><img src={insta5} className="img-fluid" alt="Instagram Post" /></Col>
      </Row>
    </Container>
  );
}

export default InstagramFeed;