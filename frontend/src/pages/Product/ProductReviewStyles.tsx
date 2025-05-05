import { Card, Empty } from "antd";
import { Content } from "antd/es/layout/layout";

import styled from "styled-components";
import CustomTypography from "../../components/custom/CustomTypography/CustomTypography";

const { Paragraph } = CustomTypography;

// export const StyledCard = styled(Card)<StyledCardProps>`
//   border-radius: ${(props) => props.borderRadius};

// `;

export const StyledCard = styled(Card)<{ borderRadius?: string }>`
  margin-bottom: 16px;
  border-radius: ${(props) => props.borderRadius || "8px"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

interface ReviewFormContainerProps {
  background: string;
  borderRadius: string;
}

export const ReviewFormContainer = styled.div<ReviewFormContainerProps>`
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 24px;
  background-color: ${(props) => props.background};
  border-radius: ${(props) => props.borderRadius};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const ProductImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

export const ReviewListContainer = styled.div`
  margin-top: 24px;
`;

interface ReviewItemProps {
  background: string;
  borderRadius: string;
}

export const ReviewItem = styled.div<ReviewItemProps>`
  padding: 16px;
  margin-bottom: 16px;
  background-color: ${(props) => props.background};
  border-radius: ${(props) => props.borderRadius};
  border: 1px solid #f0f0f0;
`;

export const NoReviewsMessage = styled(Empty)`
  margin-top: 40px;
`;

interface PageContainerProps {
  background: string;
}

export const PageContainer = styled(Content)<PageContainerProps>`
  background-color: ${(props) => props.background};
  padding: 24px;
`;

export const HeadingSection = styled.div`
  margin-bottom: 24px;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const ReviewContent = styled(Paragraph)`
  margin-top: 8px;
`;

export const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;
