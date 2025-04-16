import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Col, Flex, Row, Typography } from "antd";

export const ViewProduct = () => {
  const user = useSelector((state: RootState) => state.user);
  const [products, setProducts] = useState<any>([]);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/seller/${user.id}`,
        config
      );
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Flex vertical style={{ justifyContent: "space-around" }}>
      <Typography.Title
        level={4}
        style={{
          padding: "40px 40px 40px 40px",
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        My Product Listings
      </Typography.Title>
      <Row gutter={[16, 16]} justify="start" style={{ width: "100%", paddingBottom: 60 }}>
        {products.map((product: any, key: number) => (
          <Col key={key} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} user={user} />
          </Col>
        ))}
      </Row>
    </Flex>
  );
};
