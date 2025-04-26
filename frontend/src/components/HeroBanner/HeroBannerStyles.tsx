import styled from "styled-components";

export const HeroBannerContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  z-index: 1000;
`;

interface PageButtonProps {
  borderColor: string;
}

export const PageButton = styled.div<PageButtonProps>`
  padding: 8px;
  border-radius: 100%;
  border: 1px solid ${(props) => props.borderColor};
  cursor: pointer;
`;

interface HeroButtonProps {
  borderColor: string;
  color: string;
  background: string;
}

export const HeroButton = styled.button<HeroButtonProps>`
  padding: 8px 16px;
  border-radius: 4px;
  color: ${(props) => props.color};
  font-weight: bold;
  background: ${(props) => props.background};
  display: flex;
  gap: 8px;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    background: ${(props) => props.color};
    color: ${(props) => props.background};
  }
`;

export const CarousellContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  //   overflow: hidden;
`;

interface CarousellItemProps {
  isActive: boolean;
  isBefore: boolean;
}

export const CarousellItem = styled.div<CarousellItemProps>`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  transition: all 0.5s ease-in-out;
  opacity: ${(props) => (props.isActive ? 1 : 0)};
  transform: ${(props) => {
    if (props.isActive) return "translateX(0)";
    if (props.isBefore) return "translateX(-100%)";
    return "translateX(100%)";
  }};
`;

export const CarouselImage = styled.img`
  width: 130%;
  height: 130%;
  object-fit: contain;
`;
export const ImageCaption = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 8px 16px;
  border-radius: 4px;
`;

export const ImageCaptionText = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;
