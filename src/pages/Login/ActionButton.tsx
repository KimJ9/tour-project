import * as React from "react";
import "../../App.css"; // ✅ src/pages/Login → src/App.css로 가는 정확한 상대 경로

interface ActionButtonProps {
  href: string;
  variant?: "filled" | "outlined";
  children: React.ReactNode;
  openLinkInNewTab?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  href,
  variant = "filled",
  children,
  openLinkInNewTab = false,
}) => {
  const variantClass = variant === "filled" ? "btn-filled" : "btn-outlined";

  return (
    <a
      href={href}
      className={`btn ${variantClass}`}
      target={openLinkInNewTab ? "_blank" : undefined}
      rel={openLinkInNewTab ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
};