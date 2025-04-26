import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { BUYER, SELLER } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import { Button, Flex, InputNumber, Modal, Typography } from "antd";
import CustomCard from "../../components/custom/CustomCard/CustomCard";
import { ProductCardImgContainer } from "./ProductStyles";
import { useDesignToken } from "../../DesignToken";
import CustomButton from "../../components/custom/CustomButton/CustomButton";
import CustomTypography from "../../components/custom/CustomTypography/CustomTypography";

const ProductCard = ({ product, user, cartId }: any) => {
  const [quantity, setQuantity] = useState(0);
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
      quantity,
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
                setQuantity(0);
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
                onChange={(value) => setQuantity(value || 0)}
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
  return (
    <Flex>
      <CustomCard
        title={
          <img
            className="w-[300px] h-[200px]"
            src={`data:image/png;base64,${product.images}`}
            alt={product.name}
          />
        }
        style={{
          width: 300,
          boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
        }}
      >
        <Typography.Title level={5} style={{ color: "#0055BD" }}>
          {product.name}
        </Typography.Title>
        <Typography style={{ paddingBottom: 5, opacity: 0.6 }}>
          {product.description}
        </Typography>
        <Typography style={{ paddingBottom: 5, color: "#0055BD" }}>
          ${product.price.toFixed(2)}
        </Typography>

        {user.role == BUYER && (
          <Flex style={{ gap: 10 }}>
            <Button
              type="primary"
              style={{ marginTop: 10, width: "100%" }}
              onClick={showModal}
            >
              Add to Cart
            </Button>
            <Button
              onClick={navigateToReviews}
              style={{ marginTop: 10, width: "100%" }}
            >
              Reviews
            </Button>
            <Modal
              title={`Item: ${product.name}`}
              open={isModalOpen}
              onOk={addToCart}
              okText="Add"
              onCancel={() => {
                setIsModalOpen(false);
                setQuantity(0);
              }}
              style={{ maxWidth: "400px" }}
            >
              <Typography style={{ paddingBottom: 10, paddingTop: 10 }}>
                Quantity
              </Typography>
              <InputNumber
                value={quantity}
                onChange={(value) => setQuantity(value || 0)}
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
            disabled={product.username!==user.username}
          >
            Edit Product
          </Button>
        )}
      </CustomCard>
    </Flex>
  );
};

export default ProductCard;
