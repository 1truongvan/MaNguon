import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import tokenManager from "../../../utils/tokenManager";

type FormControlEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface PersonalUser {
  _id: string;
  name: string;
  gender?: string;
  dateOfBirth?: string | Date;
  avatar?: string;
  role: string;
}

interface PersonalInfoProps {
  user: PersonalUser;
  onUpdate: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: user.name || "",
    gender: user.gender || "",
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
    avatar: user.avatar || "",
  });

  const handleInputChange = (e: React.ChangeEvent<FormControlEl>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = tokenManager.getAccessToken();
      const res = await axios.put(
        `http://localhost:3000/api/users/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      tokenManager.setUser({
        id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
      });

      setSuccess("Cập nhật thông tin thành công!");
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Không thể cập nhật thông tin");
      } else {
        setError("Không thể cập nhật thông tin");
      }
    }
  };

  return (
    <Card>
      <Card.Header>Thông tin cá nhân</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Họ và tên *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Ngày sinh</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ảnh đại diện (URL)</Form.Label>
            <Form.Control
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="https://example.com/avatar.jpg"
            />
            {formData.avatar && (
              <div className="mt-2">
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                />
              </div>
            )}
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
                      name: user.name || "",
                      gender: user.gender || "",
                      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
                      avatar: user.avatar || "",
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

export default PersonalInfo;

