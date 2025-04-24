import React from "react";
import { Button, ButtonProps } from "antd";
import { useDesignToken } from "../../../DesignToken";

interface CustomButtonProps extends ButtonProps {}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  type,
  style,
  ...rest
}) => {
  const token = useDesignToken();

  const isDefaultType = type === "default";
  const shouldApplyCustomStyles =
    type !== "text" && type !== "link" && !isDefaultType;

  return (
    <Button
      type={type}
      {...rest}
      style={{
        ...(isDefaultType && {
          backgroundColor: "#FFFFFF",
          color: token.colorTextBase,
        }),
        ...(shouldApplyCustomStyles && {
          backgroundColor: token.colorPrimary,
          color: token.colorTextWhite,
        }),
        ...style,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
