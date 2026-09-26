// src/components/NewArri.tsx

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import ProductCard from '../ProductCard';
// Giả định sử dụng React Router/Next.js Link cho việc chuyển trang
import { Link } from 'react-router-dom'; 

// Banner
import tShirtPromoBanner from '../../assets/aothun-promo-banner.jpg'; 
import newArrivalsBanner from '../../assets/new-arrivals-banner.jpg'; // Dữ liệu mẫu

interface Product {
    imageUrl: string;
    title: string;
    price: string;
    // *** THÊM TRƯỜNG ID CẦN THIẾT CHO ROUTING ***
    productId: string;
    is_new?: boolean;
    updated_at?: string;
    created_at?: string;
}

const AO_THUN_ID = "691fdb3f917b5cd84d2a23c5"; 

const NewArri: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/products?category_id=${AO_THUN_ID}`);
                const data = await res.json();

                if (Array.isArray(data)) {
                    const apiProducts: Product[] = data.slice(0, 8).map((item: any) => ({
                        imageUrl: item.images?.[0] || '', 
                        title: item.name,
                        price: item.price?.toLocaleString('vi-VN') + '₫' || 'Liên hệ',
                        // *** LẤY ID SẢN PHẨM TỪ API ***
                        productId: item._id,
                        is_new: item.is_new === true, // Chỉ set true nếu thực sự là true
                        updated_at: item.updated_at,
                        created_at: item.created_at
                    }));
                    setProducts(apiProducts);
                }
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm Hàng Mới:", err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Container as="section" className="py-3">
            <div className="product-filter-nav">
                <a href="#" className="active">Hàng mới</a>
                <a href="#">Bán chạy</a>
                <a href="#">Đồ Thu Đông</a>
            </div>

            <Row>
                {/* Banner bên trái */}
                <Col lg={3} md={4} className="d-none d-md-block">
                    <div className="new-arrivals-promo">
                        <img src={tShirtPromoBanner} alt="Hàng Mới" className="img-fluid" />
                        <div className="promo-content">
                            <h3>Áo Thun</h3>
                            {/* Chuyển hướng banner */}
                            <Button variant="light" size="sm" as={Link} to="/men-shirt">
                                XEM NGAY
                            </Button>
                        </div>
                    </div>
                </Col>

                {/* Lưới sản phẩm */}
                <Col lg={9} md={8}>
                    <Row xs={2} md={3} lg={4} className="g-3">
                        {products.map((product, index) => (
                            <Col key={index}>
                                {/* *** BỌC ProductCard BẰNG Link *** - to={`/product/${product.productId}`} sẽ tạo URL chi tiết.
                                    - className="product-link" để loại bỏ gạch chân mặc định của Link
                                */}
                                <Link to={`/product/${product.productId}`} className="product-link">
                                    <ProductCard {...product} />
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            <div className="text-center mt-4">
                <Button variant="outline-dark" as={Link} to="/men-shirt">
                    Xem tất cả
                </Button>
            </div>
        </Container>
    );
};

export default NewArri;