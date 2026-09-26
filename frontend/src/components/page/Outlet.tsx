import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/outlet.css';
import Header from '../Header';
import Footer from '../Footer';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  category_id?: {
    _id: string;
    name: string;
  };
}

const OutletPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Lấy tất cả sản phẩm
        const response = await axios.get('http://localhost:3000/api/products/');
        const allProducts = response.data;
        
        // Lọc chỉ lấy sản phẩm có discount > 0
        const discountedProducts = allProducts.filter((product: Product) => 
          product.discount && product.discount > 0
        );
        
        // Sắp xếp theo discount giảm dần (giảm giá nhiều nhất trước)
        const sortedProducts = discountedProducts.sort((a: Product, b: Product) => {
          const discountA = a.discount || 0;
          const discountB = b.discount || 0;
          return discountB - discountA;
        });

        setProducts(sortedProducts);
        setTotalPages(Math.ceil(sortedProducts.length / itemsPerPage));
        setCurrentPage(1);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = (img: string | undefined) => {
    if (!img) return '/no-image.png';
    if (img.startsWith('http')) return img;
    return `http://localhost:3000/${img}`;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const calculateDiscountPrice = (price: number, discount: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      
      {/* Hero Section */}
      <div className="outlet-hero">
        <Container>
          <div className="text-center py-5">
            <h1 className="display-4 fw-bold text-white">OUTLET SALE</h1>
            <p className="lead text-white">Giảm giá cực sốc cho các sản phẩm được chọn</p>
          </div>
        </Container>
      </div>

      {/* Breadcrumb */}
      <Container className="py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Trang chủ</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Outlet
            </li>
          </ol>
        </nav>
      </Container>

      {/* Products Section */}
      <Container className="py-5">
        {loading ? (
          <div className="text-center py-5">
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">Hiện tại chưa có sản phẩm giảm giá nào.</p>
              </div>
            ) : (
              <>
                <Row className="g-4 mb-4">
                  {getCurrentProducts().map((product) => {
                    const discountPrice = product.discount 
                      ? calculateDiscountPrice(product.price, product.discount)
                      : product.price;
                    
                    return (
                      <Col key={product._id} md={6} lg={4} xl={3} className="outlet-product-col">
                        <Card className="outlet-product-card h-100">
                          <div className="product-image-wrapper">
                            <Card.Img 
                              variant="top" 
                              src={getImageUrl(product.images?.[0])} 
                              alt={product.name}
                              className="outlet-product-image"
                              onClick={() => handleViewProduct(product._id)}
                              style={{ cursor: 'pointer' }}
                            />
                            {product.discount && product.discount > 0 && (
                              <div className="discount-badge">-{product.discount}%</div>
                            )}
                          </div>
                          <Card.Body className="d-flex flex-column">
                            <Card.Title 
                              className="product-name"
                              onClick={() => handleViewProduct(product._id)}
                              style={{ cursor: 'pointer' }}
                            >
                              {product.name}
                            </Card.Title>
                            
                            <div className="price-section mb-3">
                              {product.discount && product.discount > 0 ? (
                                <>
                                  <span className="original-price">
                                    {formatPrice(product.price)}
                                  </span>
                                  <span className="discount-price fw-bold">
                                    {formatPrice(discountPrice)}
                                  </span>
                                </>
                              ) : (
                                <span className="discount-price fw-bold">
                                  {formatPrice(product.price)}
                                </span>
                              )}
                            </div>

                            <Button 
                              variant="danger" 
                              className="mt-auto outlet-add-btn"
                              onClick={() => handleViewProduct(product._id)}
                            >
                              Xem chi tiết
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-wrapper text-center">
                    <nav aria-label="Page navigation">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            ‹
                          </button>
                        </li>
                        {renderPagination().map((page, index) => (
                          <li
                            key={index}
                            className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                          >
                            {page === '...' ? (
                              <span className="page-link">...</span>
                            ) : (
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(page as number)}
                              >
                                {page}
                              </button>
                            )}
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            ›
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Container>

      {/* Info Section */}
      <div className="outlet-info-section py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col md={4} className="mb-3">
              <h5>🚚 Miễn phí vận chuyển</h5>
              <p className="text-muted">Cho đơn hàng trên 500.000đ</p>
            </Col>
            <Col md={4} className="mb-3">
              <h5>✅ Hàng chính hãng</h5>
              <p className="text-muted">Bảo hành 100% chính hãng</p>
            </Col>
            <Col md={4} className="mb-3">
              <h5>💳 Thanh toán linh hoạt</h5>
              <p className="text-muted">Hỗ trợ nhiều phương thức thanh toán</p>
            </Col>
          </Row>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default OutletPage;