import { Typography } from "antd";
import type { TitleProps } from "antd/es/typography/Title";
import type { ParagraphProps } from "antd/es/typography/Paragraph";
import type { TextProps } from "antd/es/typography/Text";
import React from "react";

const Title: React.FC<TitleProps> = ({ style, ...props }) => {
  return <Typography.Title style={{ margin: 0, ...style }} {...props} />;
};

const Text: React.FC<TextProps> = ({ style, ...props }) => {
  return <Typography.Text style={{ margin: 0, ...style }} {...props} />;
};

const Paragraph: React.FC<ParagraphProps> = ({ style, ...props }) => {
  return <Typography.Paragraph style={{ margin: 0, ...style }} {...props} />;
};

const CustomTypography = {
  Title,
  Text,
  Paragraph,
};

export default CustomTypography;
