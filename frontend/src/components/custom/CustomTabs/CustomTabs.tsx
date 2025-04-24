import React from "react";
import { Tabs, TabsProps } from "antd";
import { useDesignToken } from "../../../DesignToken";

interface CustomTabsProps extends TabsProps {
  // You can add more custom props if needed
}

const CustomTabs: React.FC<CustomTabsProps> = ({
  children,
  style,
  ...rest
}) => {
  const token = useDesignToken();

  return (
    <Tabs
      {...rest}
      style={{
        width: "100%",
        paddingBottom: "16px",
        color: token.colorTextBase,
        fontFamily: token.fontFamily,
        borderRadius: token.borderRadiusMed,
        ...style,
      }}
    >
      {children}
    </Tabs>
  );
};

export default CustomTabs;
