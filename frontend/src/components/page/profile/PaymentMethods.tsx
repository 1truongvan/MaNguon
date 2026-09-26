import React, { useState } from "react";
import { Card, Button, Modal, Form, Alert, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";
import tokenManager from "../../../utils/tokenManager";

interface PaymentMethodsProps {
  user: any;
  onUpdate: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ user, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    type: "credit_card",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    phone: "",
    isDefault: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isDefault: e.target.checked }));
  };

  const handleAdd = () => {
    setFormData({
      type: "credit_card",
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      phone: "",
      isDefault: false,
    });
    setShowModal(true);
  };

  const handleDelete = async (methodId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa phương thức thanh toán này?")) return;
    try {
      const token = tokenManager.getAccessToken();
      await axios.delete(`http://localhost:3000/api/users/me/payment-methods/${methodId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Xóa phương thức thanh toán thành công!");
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = tokenManager.getAccessToken();
      await axios.post("http://localhost:3000/api/users/me/payment-methods", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Thêm phương thức thanh toán thành công!");
      setShowModal(false);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const renderCardInfo = (method: any) => {
    if (method.type === "credit_card" || method.type === "debit_card") {
      const last4 = method.cardNumber ? method.cardNumber.slice(-4) : "";
      return `**** **** **** ${last4}`;
    }
    return method.phone || "";
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Phương thức thanh toán</span>
        <Button variant="primary" size="sm" onClick={handleAdd}>
          + Thêm phương thức
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

        {user.paymentMethods && user.paymentMethods.length > 0 ? (
          <Row>
            {user.paymentMethods.map((method: any) => (
              <Col md={6} key={method._id} className="mb-3">
                <Card>
                  <Card.Body>
                    {method.isDefault && (
                      <Badge bg="primary" className="mb-2">
                        Mặc định
                      </Badge>
                    )}
                    <h6 className="text-uppercase">{method.type}</h6>
                    <p className="mb-1">{renderCardInfo(method)}</p>
                    {method.cardHolder && (
                      <p className="mb-1">
                        <strong>Chủ thẻ:</strong> {method.cardHolder}
                      </p>
                    )}
                    {method.expiryDate && (
                      <p className="mb-1">
                        <strong>Hết hạn:</strong> {method.expiryDate}
                      </p>
                    )}
                    {method.phone && method.type !== "credit_card" && method.type !== "debit_card" && (
                      <p className="mb-1">
                        <strong>SĐT ví:</strong> {method.phone}
                      </p>
                    )}
                    <div className="mt-2">
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(method._id)}>
                        Xóa
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted">Chưa có phương thức thanh toán nào. Hãy thêm mới.</p>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm phương thức thanh toán</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>Loại</Form.Label>
                <Form.Select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="credit_card">Thẻ tín dụng</option>
                  <option value="debit_card">Thẻ ghi nợ</option>
                  <option value="momo">Momo</option>
                  <option value="zalopay">ZaloPay</option>
                  <option value="vnpay">VNPay</option>
                  <option value="paypal">PayPal</option>
                </Form.Select>
              </Form.Group>

              {(formData.type === "credit_card" || formData.type === "debit_card") && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Số thẻ</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Chủ thẻ</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardHolder"
                          value={formData.cardHolder}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hết hạn (MM/YY)</Form.Label>
                        <Form.Control
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                          placeholder="MM/YY"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}

              {!(formData.type === "credit_card" || formData.type === "debit_card") && (
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại ví</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              )}

              <Form.Check
                type="checkbox"
                label="Đặt làm phương thức mặc định"
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

export default PaymentMethods;

