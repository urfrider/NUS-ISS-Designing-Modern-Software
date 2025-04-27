import React from "react";
import { Select as AntSelect, SelectProps } from "antd";
import { useDesignToken } from "../../../DesignToken";

export interface CustomSelectProps extends SelectProps {}

export const CustomSelect: React.FC<CustomSelectProps> = (props) => {
  const designToken = useDesignToken();

  const customStyles = {
    selector: {
      backgroundColor: designToken.colorBgWhite,
    },
  };

  return (
    <AntSelect
      {...props}
      popupClassName="custom-select-dropdown"
      style={{
        ...customStyles.selector,
        ...props.style,
      }}
    />
  );
};
