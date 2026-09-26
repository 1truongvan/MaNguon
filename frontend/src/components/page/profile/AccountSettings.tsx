import React, { useState } from "react";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import tokenManager from "../../../utils/tokenManager";

interface AccountSettingsProps {
  user: any;
  onUpdate: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onUpdate }) => {
  const [lang, setLang] = useState(user.language || "vi");
  const [privacy, setPrivacy] = useState({
    showEmail: user.privacySettings?.showEmail || false,
    showPhone: user.privacySettings?.showPhone || false,
    allowMarketing: user.privacySettings?.allowMarketing ?? true,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = tokenManager.getAccessToken();

  const saveSettings = async () => {
    try {
      setError("");
      setSuccess("");
      await axios.put(
        `http://localhost:3000/api/users/${user._id}`,
        {
          language: lang,
          privacySettings: privacy,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Lưu thiết lập thành công");
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể lưu thiết lập");
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      await axios.post(
        "http://localhost:3000/api/users/me/change-password",
        passwordForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Đổi mật khẩu thành công");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <Card>
      <Card.Header>Thiết lập tài khoản</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <h6 className="mb-3">Ngôn ngữ & khu vực</h6>
        <Form.Group className="mb-4" controlId="language">
          <Form.Label>Ngôn ngữ</Form.Label>
          <Form.Select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </Form.Select>
        </Form.Group>

        <h6 className="mb-3">Quyền riêng tư</h6>
        <Form.Check
          type="switch"
          id="showEmail"
          label="Hiển thị email cho người khác"
          checked={privacy.showEmail}
          onChange={(e) => setPrivacy((prev) => ({ ...prev, showEmail: e.target.checked }))}
          className="mb-2"
        />
        <Form.Check
          type="switch"
          id="showPhone"
          label="Hiển thị số điện thoại cho người khác"
          checked={privacy.showPhone}
          onChange={(e) => setPrivacy((prev) => ({ ...prev, showPhone: e.target.checked }))}
          className="mb-2"
        />
        <Form.Check
          type="switch"
          id="allowMarketing"
          label="Nhận email khuyến mãi"
          checked={privacy.allowMarketing}
          onChange={(e) => setPrivacy((prev) => ({ ...prev, allowMarketing: e.target.checked }))}
          className="mb-4"
        />

        <Button variant="primary" className="mb-4" onClick={saveSettings}>
          Lưu thiết lập
        </Button>

        <hr />

        <h6 className="mb-3">Thay đổi mật khẩu</h6>
        <Form onSubmit={changePassword}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu hiện tại</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  minLength={6}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="success" type="submit">
            Đổi mật khẩu
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AccountSettings;

