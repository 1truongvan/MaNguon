import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../css/ProductDetail.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
interface Product {
  _id: string;
  name: string;
  price: number;
  code?: string;
  sizes?: number[];
  images?: string[];
  category_id?: string;
  description?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [productData, setProductData] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('MÔ TẢ');
  const [mainImage, setMainImage] = useState<string>("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const handleAddToCart = async () => {
  if (!productData) return;

  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
    navigate("/login");
    return;
  }

  const qtyInput = document.querySelector<HTMLInputElement>(".product-info__quantity");
  const quantity = qtyInput ? Number(qtyInput.value) : 1;

  if (!selectedSize) {
    alert("Vui lòng chọn size!");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:3000/api/cart/add",
      {
        product_id: productData._id,
        quantity,
        size: selectedSize
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Add to cart response:", res.data);

    alert("Đã thêm vào giỏ hàng!");
    navigate("/cart");

  } catch (err) {
    console.error("❌ Lỗi thêm giỏ hàng:", err);
    alert("Không thể thêm vào giỏ hàng!");
  }
};

  // -------------------------
  // LẤY SẢN PHẨM THEO ID
  // -------------------------
 useEffect(() => {
  if (!id) return;

  // RESET TRẠNG THÁI KHI CHUYỂN SẢN PHẨM
  setProductData(null);
  setSelectedSize(null);
  setActiveTab("MÔ TẢ");
  setMainImage("");
  setRelatedProducts([]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`);
      const data = await res.json();

      const formattedData: Product = {
        _id: data._id,
        name: data.name,
        price: data.price,
        code: data.code || "Không có mã",
        sizes: data.sizes?.length ? data.sizes : [29, 30, 31, 32, 34, 36],
        images: data.images?.length ? data.images : [],
        category_id: data.category_id,
        description: data.description || "Chưa có mô tả"
      };

      setProductData(formattedData);
      setSelectedSize(formattedData.sizes[0] || null);
      setMainImage(formattedData.images[0] || "");

      if (formattedData.category_id) {
        fetchRelated(
          (formattedData as any).category_id?._id || formattedData.category_id
        );
      }

    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  fetchProduct();
}, [id]);
const handleBuyNow = () => {
  if (!productData) return;

  if (!selectedSize) {
    alert("Vui lòng chọn size!");
    return;
  }

  const qtyInput = document.querySelector<HTMLInputElement>(".product-info__quantity");
  const quantity = qtyInput ? Number(qtyInput.value) : 1;

  // Gửi dữ liệu sang trang checkout
  navigate("/checkout", {
    state: {
      product: {
        _id: productData._id,
        name: productData.name,
        price: productData.price,
        image: productData.images?.[0],
        size: selectedSize,
        quantity: quantity
      }
    }
  });
};


  // -------------------------
  // API Lấy sản phẩm cùng loại
  // -------------------------
  const fetchRelated = async (categoryId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/products?category_id=${categoryId}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const mapped = data
          .filter((item: any) => item._id !== id)
          .slice(0, 4)
          .map((item: any) => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            images: item.images || []
          }));
        setRelatedProducts(mapped);
      }
    } catch (err) {
      console.error("Lỗi lấy sản phẩm liên quan:", err);
    }
  };

  if (!productData) return <p>Đang tải sản phẩm...</p>;

  // -------------------------
  // COMPONENT: BỘ ẢNH
  // -------------------------
  const ImageGallery = () => (
    <div className="product-gallery">
      <div className="product-gallery__thumbnails">
        {productData.images?.map((img, index) => (
          <div
            key={index}
            className="product-gallery__thumbnail-item"
            onClick={() => setMainImage(img)}
          >
            <img src={img} alt={`${productData.name} ${index}`} />
          </div>
        ))}
      </div>

      <div className="product-gallery__main-image">
        <img src={mainImage} alt={productData.name} />
      </div>
    </div>
  );

  // -------------------------
  // COMPONENT: TAB MÔ TẢ
  // -------------------------
  const DescriptionTabs = () => (
    <div className="product-description">
      <div className="product-description__tabs">
        <button
          className={`product-description__tab-button ${activeTab === "MÔ TẢ" ? "active" : ""}`}
          onClick={() => setActiveTab("MÔ TẢ")}
        >
          MÔ TẢ
        </button>
        <button
          className={`product-description__tab-button ${activeTab === "ĐỔI HÀNG" ? "active" : ""}`}
          onClick={() => setActiveTab("ĐỔI HÀNG")}
        >
          CHÍNH SÁCH ĐỔI HÀNG
        </button>
      </div>
      <div className="product-description__content">
        {activeTab === "MÔ TẢ" && productData.description}
        {activeTab === "ĐỔI HÀNG" && "Chi tiết chính sách đổi hàng..."}
      </div>
    </div>
  );

  // -------------------------
  // COMPONENT: SẢN PHẨM CÙNG LOẠI
  // -------------------------
  const RelatedProductsComp = () => (
    <div className="related-products">
      <h3 className="related-products__heading">Sản phẩm cùng loại</h3>

      <div className="related-products__list">
        {relatedProducts.map((item) => (
          <Link
            key={item._id}
            to={`/product/${item._id}`}
            className="related-products__item"
          >
            <img
              src={item.images?.[0] || "/no-image.png"}
              alt={item.name}
              className="related-products__image"
            />
            <div className="related-products__name">{item.name}</div>
            <div className="related-products__price">
              {item.price.toLocaleString("vi-VN")}₫
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="product-detail">

      <div className="product-detail__breadcrumb">
        Trang chủ / Quần / {productData.name}
      </div>

      <div className="product-detail__main-content">

        {/* Cột hình */}
        <div className="product-detail__image-column">
          <ImageGallery />
        </div>

        {/* Cột thông tin */}
        <div className="product-detail__info-column">
          <h1 className="product-info__name">{productData.name}</h1>
          <div className="product-info__code">Mã sản phẩm: {productData.code}</div>
          <div className="product-info__price">{productData.price.toLocaleString('vi-VN')}₫</div>

          <div className="product-info__promo-box">
            <div className="product-info__promo-item">Nhập mã OCT70 giảm 70K cho đơn từ 999K</div>
            <div className="product-info__promo-item">Nhập mã OCT40 giảm 40K cho đơn từ 599K</div>
            <div className="product-info__promo-item">Freeship áp dụng đơn từ 299K</div>
          </div>

          {/* SIZE */}
          <div className="product-info__size-selector">
            <div className="product-info__size-label">Kích thước {selectedSize}</div>

            <div className="product-info__size-buttons">
              {productData.sizes?.map(size => (
                <button
                  key={size}
                  className={`product-info__size-button ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <a href="#" className="product-info__size-guide">Hướng dẫn chọn size</a>
          </div>

          {/* CTA */}
          <div className="product-info__cta-group">
            <input type="number" defaultValue={1} min={1} className="product-info__quantity" />
            <button className="product-info__add-to-cart" onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
          </div>

<button 
  className="product-info__buy-now"
  onClick={handleBuyNow}
>
  MUA NGAY
</button>
        </div>
      </div>

      <div className="product-detail__service-row">
        <div className="product-detail__service-item">FreeShip</div>
        <div className="product-detail__service-item">Đổi sản phẩm</div>
        <div className="product-detail__service-item">COD</div>
        <div className="product-detail__service-item">Đổi trả trong 7 ngày</div>
      </div>

      <DescriptionTabs />
      <RelatedProductsComp />
    </div>
  );
};

export default ProductDetail;
