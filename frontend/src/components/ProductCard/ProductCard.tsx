import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BUYER, SELLER } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import { Button, Flex, InputNumber, Modal, Typography } from "antd";
import CustomCard from "../custom/CustomCard/CustomCard";
import { ProductCardImgContainer } from "./ProductCardStyles";
import { useDesignToken } from "../../DesignToken";
import CustomButton from "../custom/CustomButton/CustomButton";
import CustomTypography from "../custom/CustomTypography/CustomTypography";

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
      quantity: quantity < 1 ? 1 : quantity,
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
    } catch (e: any) {
      console.log("error adding to cart", e.response.data.error);
      toast.error(e.response.data.error);
    }
    setIsModalOpen(false);
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

  return (
    <CustomCard style={{ width: "300px", maxHeight: "430px" }}>
      <Flex vertical gap={10} align={"center"}>
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
        <CustomTypography.Text strong style={{ fontSize: token.fontSizeXl }}>
          ${product.price.toFixed(2)}
        </CustomTypography.Text>

        {user.role == BUYER && (
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

            <Modal
              title={`Item: ${product.name}`}
              open={isModalOpen}
              onOk={addToCart}
              okText="Add"
              onCancel={() => {
                setIsModalOpen(false);
                setQuantity(1);
              }}
              style={{ maxWidth: "400px" }}
            >
              <CustomTypography.Text
                style={{ paddingBottom: 10, paddingTop: 10 }}
              >
                Quantity
              </CustomTypography.Text>
              <InputNumber
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
                min={1}
                style={{ width: "100%", marginBottom: 5 }}
              />
            </Modal>
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
