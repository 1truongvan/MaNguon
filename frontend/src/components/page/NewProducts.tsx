import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import axios from 'axios';
import '../../css/new-products.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  created_at?: string | Date;
  is_new?: boolean;
  category_id?: {
    _id: string;
    name: string;
  };
}

const NewProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Chỉ lấy sản phẩm có is_new === true
        const response = await axios.get('http://localhost:3000/api/products/?is_new=true');
        const allProducts = response.data;
        
        // Lọc lại để đảm bảo chỉ có sản phẩm is_new === true (nếu có lỗi từ backend)
        const newProducts = allProducts.filter((product: Product) => product.is_new === true);
        
        // Sort by created_at (newest first)
        const sortedProducts = newProducts.sort((a: Product, b: Product) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });

        setProducts(sortedProducts);
        setTotalPages(Math.ceil(sortedProducts.length / itemsPerPage));
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

  const formatPrice = (price: number, discount?: number) => {
    const finalPrice = discount ? Math.round(price * (1 - discount / 100)) : price;
    return finalPrice.toLocaleString('vi-VN') + '₫';
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

  return (
    <div className="new-products-page">
      <Container className="py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/">Danh mục</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Sản phẩm mới
            </li>
          </ol>
        </nav>

        {/* Banner Section */}
        <Row className="mb-4">
          <Col md={8}>
            <div className="new-products-banner">
              <h1 className="new-products-title">NEW ARRIVALS</h1>
              <h2 className="new-products-subtitle">HÀNG MỚI</h2>
            </div>
          </Col>
          <Col md={4} className="text-end">
            <Button variant="outline-dark" className="sort-button">
              Sản phẩm nổi bật
              <span className="ms-2">⇅</span>
            </Button>
          </Col>
        </Row>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">Chưa có sản phẩm hàng mới nào.</p>
              </div>
            ) : (
              <Row xs={2} md={3} lg={4} xl={5} className="g-3 mb-4">
                {getCurrentProducts().map((product) => (
                  <Col key={product._id}>
                    <Link to={`/product/${product._id}`} className="product-link">
                        <ProductCard
                          imageUrl={getImageUrl(product.images?.[0])}
                          title={product.name}
                          price={formatPrice(product.price, product.discount)}
                          is_new={product.is_new}
                          updated_at={product.updated_at as string}
                          created_at={product.created_at as string}
                        />
                    </Link>
                  </Col>
                ))}
              </Row>
            )}

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
      </Container>
    </div>
  );
};

export default NewProducts;

