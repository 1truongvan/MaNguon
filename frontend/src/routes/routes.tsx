import { Routes, Route } from 'react-router-dom';
import Home from '../Home';
import Login from '../components/page/login';
import OutletPage from '../components/page/Outlet';
import SearchResultsPage from '../components/page/SearchResults';
import ResetPassword from '../components/page/ResetPassword';
import Cart from '../components/page/Cart';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminDatabase from '../components/admin/AdminDatabase';
import AdminUsers from '../components/admin/AdminUsers';
import AdminDebug from '../components/admin/AdminDebug';
import ProtectedRoute from '../components/admin/ProtectedRoute';
import Checkout from '../components/page/checkout';
import AdminCategoryList from '../components/admin/AdminCategories';
import ProductDetail from '../components/page/Detail';
import NewProducts from '../components/page/NewProducts';
import MenShirt from '../components/page/MenShirt';
import MenPants from '../components/page/MenPants';
import AllProducts from '../components/page/AllProducts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/page/Profile';
import AdminOrder from '../components/admin/AdminOrder';

function AppRoutes() {
  return (
    <Routes>

      {/* HOME */}
      <Route 
        path="/" 
        element={
          <>
            <Header />
            <Home />
            <Footer />
          </>
        } 
      />

      {/* PROFILE */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <>
              <Header />
              <Profile />
              <Footer />
            </>
          </ProtectedRoute>
        } 
      />
      {/* CART */}
      <Route 
        path="/cart" 
        element={
          <>
            <Header />
            <Cart />
            <Footer />
          </>
        } 
      />

      <Route path="/login" element={<Login />} />
      <Route path="/outlet" element={<OutletPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/debug" element={<AdminDebug />} />

      {/* PRODUCT DETAIL */}
      <Route 
        path="/product/:id" 
        element={
          <>
            <Header />
            <ProductDetail />
            <Footer />
          </>
        } 
      />

      {/* CATEGORY PAGES */}
      <Route 
        path="/new" 
        element={
          <>
            <Header />
            <NewProducts />
            <Footer />
          </>
        } 
      />

      <Route 
        path="/men-shirt" 
        element={
          <>
            <Header />
            <MenShirt />
            <Footer />
          </>
        } 
      />


      <Route 
        path="/men-pants" 
        element={
          <>
            <Header />
            <MenPants />
            <Footer />
          </>
        } 
      />

      <Route 
        path="/products" 
        element={
          <>
            <Header />
            <AllProducts />
            <Footer />
          </>
        } 
      />

      {/* ADMIN PROTECTED */}
      <Route 
        path="/men-pants" 
        element={
          <>
            <Header />
            <MenPants />
            <Footer />
          </>
        } 
      />

      <Route 
        path="/products" 
        element={
          <>
            <Header />
            <AllProducts />
            <Footer />
          </>
        } 
      />

      {/* ADMIN PROTECTED */}
      <Route 
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategoryList />} />
        <Route path="order" element={<AdminOrder />} />

        <Route path="posts" element={<div>Quản lý Bài viết - Đang phát triển</div>} />
        <Route path="contact" element={<div>Liên hệ - Đang phát triển</div>} />
        <Route path="database" element={<AdminDatabase />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;