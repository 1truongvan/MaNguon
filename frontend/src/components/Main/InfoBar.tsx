import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faExchangeAlt, faHandHoldingUsd, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import totebagBanner from '../../assets/totebag-banner.jpg'; 

interface Coupon {
  value: string;       // vd: '20.000'
  condition: string;   // vd: 'đơn từ 299K'
  code: string;        // vd: 'OCT20'
}

function InfoBar() {
  const [vouchers, setVouchers] = useState<Coupon[]>([]);

  // Lấy dữ liệu coupon từ backend
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/coupons');
        if (res.data && Array.isArray(res.data)) {
          setVouchers(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setVouchers(res.data.data);
        } else {
          console.error('API không trả về mảng coupons');
        }
      } catch (err) {
        console.error('Lỗi khi gọi API coupons:', err);
      }
    };

    fetchCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      alert(`Đã sao chép mã: ${code}`);
    });
  };

  return (
    <section className="py-5 border-bottom">
      <Container>
        {/* --- PHẦN INFO BAR GỐC --- */}
        <Row className="text-center mb-4 d-none d-md-flex">
          <Col md={3}>
            <FontAwesomeIcon icon={faTruck} className="me-2" /> Miễn phí vận chuyển
          </Col>
          <Col md={3}>
            <FontAwesomeIcon icon={faExchangeAlt} className="me-2" /> Đổi hàng tận nhà
          </Col>
          <Col md={3}>
            <FontAwesomeIcon icon={faHandHoldingUsd} className="me-2" /> Thanh toán COD
          </Col>
          <Col md={3}>
            <FontAwesomeIcon icon={faPhoneAlt} className="me-2" /> Hotline: 028.73066.060
          </Col>
        </Row>

        {/* --- PHẦN VOUCHER  --- */}
        <Row className="g-3">
          <Col lg={3} md={12}>
            <img src={totebagBanner} alt="Tặng Totebag Retro Sports" className="img-fluid rounded h-100 object-fit-cover"/>
          </Col>
          {vouchers.map((voucher, index) => (
            <Col lg={3} md={4} key={index}>
              <div className="voucher-card">
                <div className="voucher-details">
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">VOUCHER</span>
                    <span className="text-muted small">{voucher.condition}</span>
                  </div>
                  <div className="voucher-value">
                    <span className="value-amount">{voucher.value}</span>
                    <span className="voucher-currency">VND</span>
                  </div>
                  <div className="text-muted small">Nhập mã: {voucher.code}</div>
                </div>
                <Button 
                  variant="dark" 
                  className="copy-button"
                  onClick={() => handleCopy(voucher.code)}
                >
                  Sao chép
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default InfoBar;
