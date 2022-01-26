import React from "react";

interface ButtonProps {
  text: string;
  color: string;
  onClick?: () => void;
  height: string;
  width: string;
  radius: string;
  fontSize: string;
  fontColor?: string;
  border?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  height,
  width,
  radius,
  onClick,
  fontSize,
  fontColor,
  color,
  border,
  className,
}) => {
  return (
    <button
      className={className ?? ""}
      onClick={onClick}
      style={{
        backgroundColor: color,
        height,
        width,
        borderRadius: radius,
        fontSize,
        color: fontColor ?? "#fff",
        border: border ?? "none",
        fontWeight: "600",
      }}
    >
      {text}
    </button>
  );
};

export default Button;
