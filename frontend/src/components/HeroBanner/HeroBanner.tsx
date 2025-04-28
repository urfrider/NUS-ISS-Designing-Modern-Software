import { Card, Flex } from "antd";
import { useDesignToken } from "../../DesignToken";
import {
  ButtonsContainer,
  CarouselImage,
  CarousellContainer,
  CarousellItem,
  HeroBannerContainer,
  HeroButton,
  PageButton,
} from "./HeroBannerStyles";
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomTypography from "../custom/CustomTypography/CustomTypography";
import { FiArrowRight } from "react-icons/fi";
import chair from "../../assets/images/chair.png";
import djset from "../../assets/images/djset.png";
import shoes from "../../assets/images/shoes.png";
import camera from "../../assets/images/camera.png";

import headphones from "../../assets/images/headphones.jpg";

const HeroBanner = () => {
  const token = useDesignToken();

  const [page, setPage] = useState<number>(0);
  const MAX_PAGES = 4;

  const updatePage = (direction: string) => {
    if (direction === "increase") {
      if (page + 1 > MAX_PAGES) setPage(0);
      else setPage((prev) => prev + 1);
    } else {
      if (page - 1 < 0) setPage(MAX_PAGES);
      else setPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updatePage("increase");
    }, 5000);

    return () => clearInterval(interval);
  }, [page]);

  const placeholderImages = [
    {
      id: 0,
      src: shoes,
      alt: "Fashion Items",
      color: "bg-blue-100",
    },
    {
      id: 1,
      src: chair,
      alt: "Home Decor",
      color: "bg-red-100",
    },
    {
      id: 2,
      src: djset,
      alt: "Electronics",
      color: "bg-green-100",
    },
    {
      id: 3,
      src: headphones,
      alt: "Handmade Crafts",
      color: "bg-yellow-100",
    },
    {
      id: 4,
      src: camera,
      alt: "Jewelry",
      color: "bg-purple-100",
    },
  ];

  return (
    <HeroBannerContainer>
      <Card
        style={{
          //   background: token.colorOrange,
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorOrange} 100%)`,

          width: "80%",
          height: 500,
          display: "flex",
          padding: "64px",
        }}
      >
        <Flex
          vertical
          style={{
            height: "100%",
          }}
          justify="center"
          gap={24}
          align="start"
        >
          <CustomTypography.Text
            strong
            style={{
              fontSize: "64px",
              fontFamily: token.fontFamily,
              lineHeight: "70px",
              color: token.colorBgBase,
            }}
          >
            Shop Diverse,
            <br />
            Buy Direct
          </CustomTypography.Text>

          <CustomTypography.Text
            style={{
              fontSize: "19px",
              fontFamily: token.fontFamily,
              color: token.colorBgBase,
            }}
          >
            Browse a wide variety of unique products
            <br /> from independent sellers
          </CustomTypography.Text>

          <HeroButton
            borderColor={token.colorBgBase}
            color={token.colorTextBase}
            background={token.colorBgBase}
          >
            Start Now <FiArrowRight size={20} />
          </HeroButton>
        </Flex>
        <CarousellContainer>
          {placeholderImages.map((image, index) => (
            <CarousellItem
              key={image.id}
              isActive={index === page}
              isBefore={index < page}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CarouselImage src={image.src} alt={image.alt} />
              </div>
            </CarousellItem>
          ))}
        </CarousellContainer>
      </Card>
      <ButtonsContainer>
        <PageButton
          borderColor={token.colorTextBase}
          onClick={() => {
            updatePage("increase");
          }}
        >
          <MdKeyboardArrowLeft size={20} />
        </PageButton>
        <PageButton
          borderColor={token.colorTextBase}
          onClick={() => {
            updatePage("decrease");
          }}
        >
          <MdKeyboardArrowRight size={20} />
        </PageButton>
      </ButtonsContainer>
    </HeroBannerContainer>
  );
};

export default HeroBanner;
