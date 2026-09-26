// src/components/HeroBanner.tsx
import { Carousel } from 'react-bootstrap';

// Thay thế bằng đường dẫn ảnh của bạn trong thư mục assets
import banner1 from '../../assets/banner-friends.jpg';
import banner2 from '../../assets/banner-jeans.jpg';

function HeroBanner() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={banner1} // Đường dẫn ảnh
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={banner2} // Đường dẫn ảnh
          alt="Second slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default HeroBanner;