import * as React from "react";
import "../../App.css"; // ✅ 정확한 경로로 수정

export const GuestLink: React.FC = () => {
  return (
    <a href="/guest" className="guest-link">
      Continue as a guest
    </a>
  );
};