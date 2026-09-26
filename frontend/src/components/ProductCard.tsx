// src/components/ProductCard.tsx
interface ProductCardProps {
  tag?: string;
  imageUrl: string;
  title: string;
  price: string;
  is_new?: boolean;
  updated_at?: string;
  created_at?: string;
}
import "../css/card.css"
function ProductCard({ tag, imageUrl, title, price, is_new, updated_at, created_at }: ProductCardProps) {
  // Chỉ hiển thị tag "HÀNG MỚI" nếu is_new = true (không dùng tag hardcode)
  const showNewTag = is_new === true;
  
  // Kiểm tra xem sản phẩm có được chỉnh sửa sau khi tạo không
  const isEdited = updated_at && created_at && new Date(updated_at) > new Date(created_at);
  
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {showNewTag && <span className="product-tag">HÀNG MỚI</span>}
        {isEdited && !showNewTag && <span className="product-tag product-tag-edited">ĐÃ CHỈNH SỬA</span>}
        <img src={imageUrl} alt={title} className="product-card-img" />
      </div>
      <div className="product-info">
        <h6 className="product-title">{title}</h6>
        <p className="product-price">{price}</p>
      </div>
    </div>
  );
}

export default ProductCard;