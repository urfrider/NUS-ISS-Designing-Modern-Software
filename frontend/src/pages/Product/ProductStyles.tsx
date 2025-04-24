import styled from "styled-components";

interface ProductCardImgProps {
  background?: string;
  borderRadius?: string;
}

export const ProductCardImgContainer = styled.img<ProductCardImgProps>`
  width: 300px;
  height: 200px;
  object-fit: contain;
  object-fit: cover;
  background-color: ${(props) => props.background || "#F7F8FA"};
  border-radius: ${(props) => props.borderRadius || "8px"};
  padding: 8px;
  margin-bottom: 4px;
`;
