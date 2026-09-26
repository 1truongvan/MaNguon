import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import axiosInstance from '../../utils/axiosConfig';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  description: string;
  images: string[];
  category_id: Record<string, unknown>;
}

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔍 Searching with query:', query);
        console.log('📡 API URL:', axiosInstance.defaults.baseURL);
        const response = await axiosInstance.get('/products/search/query', {
          params: { q: query }
        });
        console.log('✅ Search response:', response.data);
        setProducts(response.data);
      } catch (err) {
        console.error('❌ Search error:', err);
        if (err instanceof Error) {
          setError(`Lỗi: ${err.message}`);
        } else {
          setError('Lỗi khi tìm kiếm sản phẩm');
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Calculate discount price
  const getDiscountPrice = (price: number, discount: number) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  // Get image URL
  const getImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return images[0];
    }
    return 'https://via.placeholder.com/300x400?text=No+Image';
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow-1 py-5">
        <Container>
          {/* Search Info */}
          <div className="mb-4">
            <h2 className="fw-bold mb-2">
              Kết quả tìm kiếm cho: <span className="text-danger">"{query}"</span>
            </h2>
            <p className="text-muted">
              Tìm thấy {products.length} sản phẩm
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-2 text-muted">Đang tìm kiếm sản phẩm...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Search Results or Empty State */}
          {!loading && products.length > 0 ? (
         <Row className="g-4">
  {products.map((product) => (
    <Col key={product._id} md={6} lg={4} className="search-result-col">
      <Link 
        to={`/product/${product._id}`} 
        className="text-decoration-none text-dark"
        style={{ cursor: "pointer" }}
      >
        <Card className="search-result-card h-100">
          <div className="product-image-wrapper">
            <Card.Img
              variant="top"
              src={getImageUrl(product.images)}
              alt={product.name}
              className="search-product-image"
            />
            {product.discount > 0 && (
              <div className="discount-badge">-{product.discount}%</div>
            )}
          </div>

          <Card.Body className="d-flex flex-column">
            <Card.Title className="search-product-name">
              {product.name}
            </Card.Title>

            <div className="search-price-section mb-3">
              <span className="search-original-price">
                {product.price?.toLocaleString('vi-VN')}đ
              </span>
              <span className="search-discount-price fw-bold">
                {getDiscountPrice(product.price, product.discount).toLocaleString('vi-VN')}đ
              </span>
            </div>

            <Button
              variant="danger"
              className="mt-auto search-add-btn"
              onClick={(e) => e.preventDefault()} 
            >
              Thêm vào giỏ
            </Button>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  ))}
</Row>
          ) : !loading && !error && (
            <div className="text-center py-5">
              <h4 className="text-muted">😔 Không tìm thấy sản phẩm</h4>
              <p className="text-muted">
                Vui lòng thử tìm kiếm với từ khóa khác
              </p>
            </div>
          )}
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
