import { InputNumber, InputNumberProps } from "antd";
import { useDesignToken } from "../../../DesignToken";

interface CustomInputProps extends InputNumberProps {}

const CustomInputNumber = (props: CustomInputProps) => {
  const token = useDesignToken();
  const { style, ...restProps } = props;

  const componentStyles = {
    background: token.colorBgWhite,
    ...props.style,
  };

  return <InputNumber style={componentStyles} {...restProps} />;
};

export default CustomInputNumber;
