import { Input, InputProps } from "antd";
import { useDesignToken } from "../../../DesignToken";
import { PasswordProps, TextAreaProps } from "antd/es/input";

interface CustomInputProps extends InputProps {}
const CustomInput: React.FC<InputProps> = (props) => {
  const token = useDesignToken();
  const { style, ...restProps } = props;
  const componentStyles = {
    background: token.colorBgWhite,
    ...style,
  };

  return <Input style={componentStyles} {...restProps} />;
};

const CustomPassword: React.FC<PasswordProps> = (props) => {
  const token = useDesignToken();
  const { style, ...restProps } = props;

  const componentStyles = {
    background: token.colorBgWhite,
    ...style,
  };
  return <Input.Password style={componentStyles} {...restProps} />;
};

const CustomTextArea: React.FC<TextAreaProps> = (props) => {
  const token = useDesignToken();
  const { style, ...restProps } = props;
  const componentStyles = {
    background: token.colorBgWhite,
    ...style,
  };

  return <Input.TextArea style={componentStyles} {...restProps} />;
};

const CustomInputComponent = {
  CustomPassword,
  CustomTextArea,
  CustomInput,
};

export default CustomInputComponent;
