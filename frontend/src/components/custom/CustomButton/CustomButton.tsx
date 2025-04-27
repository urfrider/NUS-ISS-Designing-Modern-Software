import React from "react";
import { Button, ButtonProps } from "antd";
import { useDesignToken } from "../../../DesignToken";

interface CustomButtonProps extends ButtonProps {}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  type = "default",
  danger,
  style,
  ...rest
}) => {
  const token = useDesignToken();

  const isDefaultType = type === "default";
  const shouldApplyCustomStyles =
    type !== "text" && type !== "link" && !isDefaultType;

  // Prepare your custom base styles
  const customBaseStyle = {
    ...(isDefaultType && {
      backgroundColor: "#FFFFFF",
      color: danger ? token.colorError : token.colorTextBase,
    }),
    ...(shouldApplyCustomStyles && {
      backgroundColor: danger ? token.colorError : token.colorPrimary,
      color: token.colorTextWhite,
    }),
    // Handle danger styling for text and link buttons
    ...((type === "text" || type === "link") &&
      danger && {
        color: token.colorError,
      }),
  };

  return (
    <Button
      type={type}
      danger={danger}
      {...rest} // pass all other AntD props
      style={{
        ...customBaseStyle, // first apply custom base style
        ...style, // allow inline style to override everything
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
