// src/components/TechUrbanSection.tsx
import { useState } from 'react'; // 1. Import useState để quản lý trạng thái
import { Container, Modal } from 'react-bootstrap'; // 2. Import Modal
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

// Import ảnh nền của bạn
import techUrbanBanner from '../../assets/tech-urban-banner.jpg';

function TimHieu() {
  // 3. Tạo một state để kiểm soát việc đóng/mở Modal
  const [showModal, setShowModal] = useState(false);

  // 4. Hàm để đóng và mở Modal
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <> {/* Bọc ngoài bằng React.Fragment */}
      <Container as="section" className="py-3 text-center">
        <h2 className="section-title mb-4">Tìm Hiểu TechUrban® Jeans</h2>
        
        {/* 5. Gắn sự kiện onClick vào đây để mở Modal */}
        <div className="video-thumbnail-wrapper" onClick={handleShow}>
          <img src={techUrbanBanner} alt="TechUrban Jeans Collection" className="img-fluid" />
          <div className="play-button-overlay">
            <FontAwesomeIcon icon={faPlay} />
          </div>
        </div>
      </Container>

      {/* 6. Thêm Modal vào đây. Nó sẽ bị ẩn theo mặc định */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Nhac Hay</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="video-responsive">
            <iframe
              width="100%"
              height="480"
              src="https://www.youtube.com/embed/1rGUskjMzcU?autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TimHieu;