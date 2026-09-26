import React from "react";
import { Card, ProgressBar, Badge } from "react-bootstrap";

interface MembershipLevelProps {
  user: any;
}

const levelThresholds: Record<string, { min: number; label: string; variant: string }> = {
  bronze: { min: 0, label: "Đồng", variant: "secondary" },
  silver: { min: 1000, label: "Bạc", variant: "info" },
  gold: { min: 3000, label: "Vàng", variant: "warning" },
  platinum: { min: 6000, label: "Bạch kim", variant: "primary" },
};

const MembershipLevel: React.FC<MembershipLevelProps> = ({ user }) => {
  const points = user.membershipPoints || 0;
  const level = user.membershipLevel || "bronze";

  const current = levelThresholds[level] || levelThresholds.bronze;

  const nextLevel = Object.entries(levelThresholds)
    .map(([key, val]) => ({ key, ...val }))
    .filter((l) => l.min > current.min)
    .sort((a, b) => a.min - b.min)[0];

  const progress =
    nextLevel && nextLevel.min > 0 ? Math.min(100, Math.round((points / nextLevel.min) * 100)) : 100;

  return (
    <Card>
      <Card.Header>Cấp độ thành viên</Card.Header>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <h5 className="mb-0 me-2">Cấp hiện tại:</h5>
          <Badge bg={current.variant}>{current.label}</Badge>
        </div>
        <p className="mb-2">
          Điểm tích lũy: <strong>{points}</strong>
        </p>
        {nextLevel ? (
          <>
            <p className="mb-1">
              Cần <strong>{nextLevel.min - points}</strong> điểm nữa để đạt <strong>{nextLevel.label}</strong>
            </p>
            <ProgressBar now={progress} label={`${progress}%`} />
          </>
        ) : (
          <p className="mb-0">Bạn đã đạt cấp cao nhất.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default MembershipLevel;

