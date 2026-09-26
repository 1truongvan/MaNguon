import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import tokenManager from "../../../utils/tokenManager";

interface ContactInfoProps {
  user: any;
  onUpdate: () => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = tokenManager.getAccessToken();
      await axios.put(
        `http://localhost:3000/api/users/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Cập nhật thông tin thành công!");
      setIsEditing(false);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể cập nhật thông tin");
    }
  };

  return (
    <Card>
      <Card.Header>Thông tin liên hệ</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ liên hệ</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            {!isEditing ? (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button variant="success" type="submit">
                  Lưu
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      email: user.email || "",
                      phone: user.phone || "",
                      address: user.address || "",
                    });
                  }}
                >
                  Hủy
                </Button>
              </>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ContactInfo;

