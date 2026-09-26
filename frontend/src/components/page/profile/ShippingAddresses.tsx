import React, { useState } from "react";
import { Card, Button, Modal, Form, Alert, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";
import tokenManager from "../../../utils/tokenManager";

interface ShippingAddressesProps {
  user: any;
  onUpdate: () => void;
}

const ShippingAddresses: React.FC<ShippingAddressesProps> = ({ user, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    province: "",
    isDefault: false,
    note: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isDefault: e.target.checked }));
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setFormData({
      name: "",
      phone: "",
      address: "",
      ward: "",
      district: "",
      province: "",
      isDefault: false,
      note: "",
    });
    setShowModal(true);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setFormData({
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      ward: address.ward || "",
      district: address.district || "",
      province: address.province || "",
      isDefault: address.isDefault || false,
      note: address.note || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = tokenManager.getAccessToken();

      if (editingAddress) {
        await axios.put(
          `http://localhost:3000/api/users/me/shipping-addresses/${editingAddress._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Cập nhật địa chỉ thành công!");
      } else {
        await axios.post(
          "http://localhost:3000/api/users/me/shipping-addresses",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Thêm địa chỉ thành công!");
      }

      setShowModal(false);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

    try {
      const token = tokenManager.getAccessToken();
      await axios.delete(`http://localhost:3000/api/users/me/shipping-addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Xóa địa chỉ thành công!");
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Địa chỉ nhận hàng</span>
        <Button variant="primary" size="sm" onClick={handleAdd}>
          + Thêm địa chỉ
        </Button>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        {user.shippingAddresses && user.shippingAddresses.length > 0 ? (
          <Row>
            {user.shippingAddresses.map((address: any) => (
              <Col md={6} key={address._id} className="mb-3">
                <Card>
                  <Card.Body>
                    {address.isDefault && (
                      <Badge bg="primary" className="mb-2">
                        Mặc định
                      </Badge>
                    )}
                    <h6>{address.name}</h6>
                    <p className="mb-1">
                      <strong>SĐT:</strong> {address.phone}
                    </p>
                    <p className="mb-1">{address.address}</p>
                    {(address.ward || address.district || address.province) && (
                      <p className="mb-1">
                        {[address.ward, address.district, address.province].filter(Boolean).join(", ")}
                      </p>
                    )}
                    {address.note && <p className="text-muted small">{address.note}</p>}
                    <div className="mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(address)}
                        className="me-2"
                      >
                        Sửa
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(address._id)}>
                        Xóa
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted">Chưa có địa chỉ nào. Hãy thêm địa chỉ đầu tiên!</p>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group className="mb-3">
                <Form.Label>Tên người nhận *</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại người nhận *</Form.Label>
                <Form.Control type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ *</Form.Label>
                <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} required />
              </Form.Group>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phường/Xã</Form.Label>
                    <Form.Control type="text" name="ward" value={formData.ward} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Quận/Huyện</Form.Label>
                    <Form.Control type="text" name="district" value={formData.district} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tỉnh/Thành phố</Form.Label>
                    <Form.Control type="text" name="province" value={formData.province} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Ghi chú giao hàng</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Giao vào giờ hành chính"
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                label="Đặt làm địa chỉ mặc định"
                checked={formData.isDefault}
                onChange={handleCheckboxChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                Lưu
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default ShippingAddresses;

