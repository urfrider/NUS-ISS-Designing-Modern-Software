import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BUYER, SELLER } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Typography } from "antd";
import CustomCard from "../custom/CustomCard/CustomCard";
import { ProductCardImgContainer } from "./ProductCardStyles";
import { useDesignToken } from "../../DesignToken";
import CustomButton from "../custom/CustomButton/CustomButton";
import CustomTypography from "../custom/CustomTypography/CustomTypography";
import ProductDetailsModal from "../ProductDetailsModal/ProductDetailsModal";

const { Text } = Typography;

const ProductCard = ({ product, user, cartId }: any) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const token = useDesignToken();

  const addToCart = async () => {
    const data = {
      username: user?.username,
      productId: product.id,
      quantity: quantity,
      cartId,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL!}/api/cart/add`, data, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log("successfully added to cart");
      toast.success(`Added to cart!`);
      setIsModalOpen(false);
    } catch (e: any) {
      console.log("error adding to cart", e.response.data.error);
      toast.error(e.response.data.error);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setQuantity(1);
  };

  const editProduct = () => {
    navigate(`/editProduct/${product.id}`);
  };

  function navigateToReviews(): void {
    navigate(`/product/${product.id}/reviews`, {
      state: { user: user, product: product, cartId: cartId },
    });
  }

  const textStyles = {
    color: token.colorTextBase,
    fontSize: token.fontSizeSmall,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
    maxWidth: "100%",
  };

  useEffect(() => {
    if (quantity < 1) {
      setQuantity(1);
    }
  }, [quantity]);

  // Calculate discounted price if hasDiscount is true
  const discountedPrice = product.hasDiscount
    ? product.price * (1 - product.discountPercentage / 100)
    : null;

  return (
    <CustomCard style={{ width: "300px", height: "430px" }}>
      <Flex vertical gap={10} align={"center"} justify="space-between">
        <ProductCardImgContainer
          src={`data:image/png;base64,${product.images}`}
          alt={product.name}
          background={token.colorBgBase}
          borderRadius={token.borderRadiusSmall}
        />
        <CustomTypography.Text
          strong
          style={{
            ...textStyles,
            fontSize: token.fontSizeLg,
          }}
        >
          {product.name}
        </CustomTypography.Text>
        <CustomTypography.Text
          style={{
            ...textStyles,
            opacity: token.opacityTextSecondary,
          }}
        >
          {product.description}
        </CustomTypography.Text>

        {/* Price display with discount handling */}
        {product.hasDiscount ? (
          <Flex align="center" gap={8}>
            <Text
              delete
              type="secondary"
              style={{ fontSize: token.fontSizeLg }}
            >
              ${product.price.toFixed(2)}
            </Text>
            <CustomTypography.Text
              strong
              style={{ fontSize: token.fontSizeXl, color: token.colorError }}
            >
              ${discountedPrice?.toFixed(2)}
            </CustomTypography.Text>
          </Flex>
        ) : (
          <CustomTypography.Text strong style={{ fontSize: token.fontSizeXl }}>
            ${product.price.toFixed(2)}
          </CustomTypography.Text>
        )}

        {/* Display discount percentage badge when applicable */}
        {product.hasDiscount && (
          <Text
            style={{
              backgroundColor: token.colorError,
              color: token.colorBgWhite,
              fontSize: token.fontSizeSmall,
              padding: "2px 8px",
              borderRadius: token.borderRadiusSmall,
              marginTop: "-8px",
            }}
          >
            {product.discountPercentage}% OFF
          </Text>
        )}

        {user.role === BUYER && (
          <Flex gap={10}>
            <CustomButton
              type="default"
              onClick={navigateToReviews}
              style={{ marginTop: 10, width: "100%" }}
            >
              Reviews
            </CustomButton>
            <CustomButton
              type="primary"
              style={{ marginTop: 10, width: "100%" }}
              onClick={showModal}
            >
              Add to Cart
            </CustomButton>

            <ProductDetailsModal
              product={product}
              isOpen={isModalOpen}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onCancel={handleModalCancel}
              onOk={addToCart}
            />
          </Flex>
        )}

        {user.role === SELLER && (
          <Button
            type="primary"
            style={{ marginTop: 10, width: "100%" }}
            onClick={editProduct}
          >
            Edit Product
          </Button>
        )}
      </Flex>
    </CustomCard>
  );
};

export default ProductCard;
