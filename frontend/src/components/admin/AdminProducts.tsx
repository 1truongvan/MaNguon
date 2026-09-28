import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import type { Product, Category } from './productTypes';

import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Alert,
} from 'react-bootstrap';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [deleteProductId, setDeleteProductId] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');

  const [filterIsNew, setFilterIsNew] = useState('all');

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const API_URL = 'https://manguon-4d.onrender.com/api/products';
  const CATEGORIES_URL = 'https://manguon-4d.onrender.com/api/categories';

  // =========================
  // AUTH
  // =========================

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setProducts(response.data);

      setError('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          'Không thể tải danh sách sản phẩm: ' +
            (err.response?.data?.error || err.message)
        );
      } else {
        setError('Không thể tải danh sách sản phẩm.');
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORIES_URL);

      setCategories(response.data);
    } catch (err: unknown) {
      console.error('Không thể tải danh mục:', err);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =========================
  // ADD
  // =========================

  const handleAddNew = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (id: string) => {
    setDeleteProductId(id);
    setShowDeleteModal(true);
  };

  // =========================
  // CONFIRM DELETE
  // =========================

  const confirmDelete = async () => {
    if (!deleteProductId) return;

    try {
      await axios.delete(
        `${API_URL}/${deleteProductId}`,
        getAuthHeaders()
      );

      setSuccess('Xóa sản phẩm thành công!');

      setShowDeleteModal(false);
      setDeleteProductId(null);

      await fetchProducts();

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          'Không thể xóa sản phẩm: ' +
            (err.response?.data?.error || err.message)
        );
      } else {
        setError('Không thể xóa sản phẩm.');
      }

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  // =========================
  // FORM SUCCESS
  // =========================

  const handleFormSubmit = async () => {
    setShowModal(false);
    setSelectedProduct(null);

    await fetchProducts();

    setSuccess('Thao tác thành công!');

    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  // =========================
  // FILTER
  // =========================

  const filteredProducts = products.filter((product) => {
    const searchValue = searchTerm.toLowerCase().trim();

    let matchesSearch = true;

    if (searchValue) {
      if (searchBy === 'name') {
        matchesSearch = product.name
          .toLowerCase()
          .includes(searchValue);
      }

      if (searchBy === 'category') {
        matchesSearch =
          product.category_id?.name
            ?.toLowerCase()
            .includes(searchValue) || false;
      }
    }

    let matchesIsNew = true;

    if (filterIsNew === 'new') {
      matchesIsNew = product.is_new === true;
    }

    if (filterIsNew === 'not-new') {
      matchesIsNew = product.is_new !== true;
    }

    return matchesSearch && matchesIsNew;
  });

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="admin-products">
      <Container fluid>

        <nav className="admin-breadcrumbs">
          <span>Trang chủ</span> /{' '}
          <span>Danh mục</span> /{' '}
          <span>Sản phẩm</span>
        </nav>

        {/* ERROR */}
        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* SUCCESS */}
        {success && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        {/* ACTION BAR */}
        <div className="admin-action-bar">
          <div className="admin-action-group">

            <Form.Select
              size="sm"
              style={{ width: '150px' }}
            >
              <option>Tác vụ</option>
            </Form.Select>

            <Form.Control
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              size="sm"
              style={{ width: '200px' }}
            />

            <Form.Select
              size="sm"
              value={searchBy}
              onChange={(e) =>
                setSearchBy(e.target.value)
              }
              style={{ width: '150px' }}
            >
              <option value="name">
                Tìm theo tên
              </option>

              <option value="category">
                Tìm theo danh mục
              </option>
            </Form.Select>

            <Form.Select
              size="sm"
              value={filterIsNew}
              onChange={(e) =>
                setFilterIsNew(e.target.value)
              }
              style={{ width: '150px' }}
            >
              <option value="all">
                Tất cả
              </option>

              <option value="new">
                Hàng mới
              </option>

              <option value="not-new">
                Không phải hàng mới
              </option>
            </Form.Select>

            <Form.Select
              size="sm"
              value={itemsPerPage}
              onChange={(e) =>
                setItemsPerPage(
                  Number(e.target.value)
                )
              }
              style={{ width: '150px' }}
            >
              <option value={10}>
                Hiển thị 10
              </option>

              <option value={20}>
                Hiển thị 20
              </option>

              <option value={50}>
                Hiển thị 50
              </option>

              <option value={100}>
                Hiển thị 100
              </option>
            </Form.Select>

          </div>

          <Button
            variant="primary"
            onClick={handleAddNew}
          >
            + Thêm mới
          </Button>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-5">
            <p>Đang tải...</p>
          </div>
        ) : (
          <div className="admin-table-container">

            <Table
              striped
              bordered
              hover
              responsive
            >
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>
                    STT
                  </th>

                  <th>Danh mục</th>
                  <th>Tiêu đề</th>

                  <th style={{ width: '100px' }}>
                    Ảnh
                  </th>

                  <th>Giá</th>
                  <th>Giảm giá</th>
                  <th>Số lượng</th>

                  <th style={{ width: '120px' }}>
                    Hàng mới
                  </th>

                  <th style={{ width: '100px' }}>
                    Tác vụ
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-4"
                    >
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  filteredProducts
                    .slice(0, itemsPerPage)
                    .map((product, index) => (
                      <tr key={product._id}>

                        <td>{index + 1}</td>

                        <td>
                          {product.category_id?.name ||
                            'Chưa phân loại'}
                        </td>

                        <td>
                          <strong>
                            {product.name}
                          </strong>
                        </td>

                        <td>
                          {product.images &&
                          product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                              }}
                            >
                              <span>No img</span>
                            </div>
                          )}
                        </td>

                        <td>
                          {formatPrice(
                            product.price || 0
                          )}
                        </td>

                        <td>
                          {product.discount || 0}%
                        </td>

                        <td>
                          {product.quantity || 0}
                        </td>

                        <td>
                          {product.is_new ? (
                            <span
                              style={{
                                display: 'inline-block',
                                backgroundColor: '#1A0F4A',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                              }}
                            >
                              HÀNG MỚI
                            </span>
                          ) : (
                            <span
                              style={{
                                color: '#999',
                                fontSize: '0.875rem',
                              }}
                            >
                              -
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="admin-action-buttons">

                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                handleEdit(product)
                              }
                              title="Sửa"
                            >
                              ✏️
                            </Button>

                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                handleDelete(
                                  product._id
                                )
                              }
                              title="Xóa"
                            >
                              🗑️
                            </Button>

                          </div>
                        </td>

                      </tr>
                    ))
                )}
              </tbody>
            </Table>

          </div>
        )}

        {/* ADD / EDIT */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedProduct
                ? 'Sửa sản phẩm'
                : 'Thêm sản phẩm mới'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ProductForm
              product={selectedProduct}
              categories={categories}
              onSuccess={handleFormSubmit}
              onCancel={() => setShowModal(false)}
            />
          </Modal.Body>
        </Modal>

        {/* DELETE */}
        <Modal
          show={showDeleteModal}
          onHide={() =>
            setShowDeleteModal(false)
          }
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Xác nhận xóa
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm
              này không?
            </p>

            <p className="text-muted">
              Hành động này không thể hoàn tác.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() =>
                setShowDeleteModal(false)
              }
            >
              Hủy
            </Button>

            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </div>
  );
};

export default AdminProducts;