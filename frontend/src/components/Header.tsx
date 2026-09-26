import { Navbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchBar from './SearchBar';
import tokenManager from '../utils/tokenManager';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = tokenManager.getUser();
    setUser(currentUser);
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    tokenManager.clearTokens();
    setUser(null);
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="lg" className="sticky-top border-bottom">
      <Container fluid className="px-md-5">
        <Navbar.Brand as={Link} to="/" className="fw-bolder">ICON DENIM</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="mx-auto">
            <Link to="/products" className="nav-link">Sản phẩm</Link>
            <Link to="/new" className="nav-link fw-bold">Hàng Mới</Link>
            <Link to="/men-shirt" className="nav-link">Áo Nam</Link>
            <Link to="/men-pants" className="nav-link">Quần Nam</Link>

            {/* FIXED ↓ */}
            <span className="nav-link" style={{ cursor: "pointer" }}>DENIM</span>
            <span className="nav-link" style={{ cursor: "pointer" }}>TechUrban</span>
            {/* FIXED ↑ */}

            <Link to="/outlet" className="nav-link">
              <span className="text-danger fw-bold">-50% OUTLET</span>
            </Link>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            <SearchBar onSearch={handleSearch} />
            <Link to="/cart" className="nav-icon"><FontAwesomeIcon icon={faShoppingBag} /></Link>

            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span 
                  style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
                  onClick={() => navigate("/profile")}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0056b3"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#007bff"}
                >
                  {user.name}
                </span>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="btn btn-outline-dark btn-sm">Đăng nhập</button>
              </Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Header;