import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import axios from 'axios';
import '../../css/all-products.css';

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

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:3000/api/products/';
        
        // If a specific category is selected, filter by it
        if (selectedCategory !== 'all') {
          url += `?category_id=${selectedCategory}`;
        }
        
        const response = await axios.get(url);
        let allProducts = response.data;

        // Filter by category group if selected
        if (selectedCategory === 'ao') {
          allProducts = allProducts.filter((product: Product) => {
            const categoryName = product.category_id?.name?.toLowerCase() || '';
            const productName = product.name?.toLowerCase() || '';
            return (
              categoryName.includes('áo') ||
              categoryName.includes('ao') ||
              productName.includes('áo') ||
              productName.includes('ao')
            );
          });
        } else if (selectedCategory === 'quan') {
          allProducts = allProducts.filter((product: Product) => {
            const categoryName = product.category_id?.name?.toLowerCase() || '';
            const productName = product.name?.toLowerCase() || '';
            return (
              categoryName.includes('quần') ||
              categoryName.includes('quan') ||
              productName.includes('quần') ||
              productName.includes('quan')
            );
          });
        } else if (selectedCategory === 'phu-kien') {
          allProducts = allProducts.filter((product: Product) => {
            const categoryName = product.category_id?.name?.toLowerCase() || '';
            const productName = product.name?.toLowerCase() || '';
            return (
              categoryName.includes('phụ kiện') ||
              categoryName.includes('phu kien') ||
              categoryName.includes('nón') ||
              categoryName.includes('non') ||
              categoryName.includes('túi') ||
              categoryName.includes('tui') ||
              categoryName.includes('giày') ||
              categoryName.includes('giay') ||
              productName.includes('phụ kiện') ||
              productName.includes('phu kien') ||
              productName.includes('nón') ||
              productName.includes('non')
            );
          });
        }

        // Sort by created_at (newest first)
        const sortedProducts = allProducts.sort((a: Product, b: Product) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });

        setProducts(sortedProducts);
        setTotalPages(Math.ceil(sortedProducts.length / itemsPerPage));
        setCurrentPage(1); // Reset to first page when filter changes
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

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

  // Category groups
  const categoryGroups = [
    { id: 'all', name: 'Tất cả', link: '/products' },
    { id: 'ao', name: 'Nhóm áo', link: '/men-shirt' },
    { id: 'quan', name: 'Nhóm Quần', link: '/men-pants' },
    { id: 'phu-kien', name: 'Nhóm Phụ Kiện', link: '/products?category=phu-kien' },
  ];

  return (
    <div className="all-products-page">
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
              Tất cả sản phẩm
            </li>
          </ol>
        </nav>

        {/* Hero Banner Section */}
        <Row className="mb-4 hero-section">
          <Col md={6} className="hero-image-col">
            <div className="hero-image-wrapper">
              <img 
                src="https://cdn.hstatic.net/files/1000360022/file/4hinh-04.jpg" 
                alt="Tất cả sản phẩm" 
                className="hero-image"
              />
            </div>
          </Col>
          <Col md={6} className="hero-text-col">
            <div className="hero-text-content">
              <h1 className="hero-title">TẤT CẢ SẢN PHẨM</h1>
              <h2 className="hero-subtitle">All Items</h2>
            </div>
          </Col>
        </Row>

        {/* Category Groups Section */}
        <Row className="mb-4 category-groups-section">
          {categoryGroups.map((group) => (
            <Col xs={6} md={4} key={group.id} className="mb-3">
              <Link to={group.link} className="category-group-card">
                <div className="category-group-icon">
                  {group.id === 'ao' && '👕'}
                  {group.id === 'quan' && '👖'}
                  {group.id === 'phu-kien' && '🧢'}
                  {group.id === 'all' && '📦'}
                </div>
                <div className="category-group-name">{group.name}</div>
              </Link>
            </Col>
          ))}
        </Row>

        {/* Sort and Filter */}
        <Row className="mb-4">
          <Col xs="auto" className="ms-auto">
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
            <Row xs={2} md={3} lg={4} xl={5} className="g-3 mb-4">
              {getCurrentProducts().length === 0 ? (
                <Col xs={12} className="text-center py-5">
                  <p>Không có sản phẩm nào</p>
                </Col>
              ) : (
                getCurrentProducts().map((product) => (
                  <Col key={product._id}>
                    <Link to={`/product/${product._id}`} className="product-link">
                      <ProductCard
                        imageUrl={getImageUrl(product.images?.[0])}
                        title={product.name}
                        price={formatPrice(product.price, product.discount)}
                        is_new={product.is_new}
                      />
                    </Link>
                  </Col>
                ))
              )}
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
      </Container>
    </div>
  );
};

export default AllProducts;

