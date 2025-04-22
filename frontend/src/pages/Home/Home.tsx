import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import ProductCard from "../Product/ProductCard";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Layout,
  Row,
  Select,
} from "antd";
import { Content } from "antd/es/layout/layout";

import HeroBanner from "../../components/HeroBanner/HeroBanner";
import { useDesignToken } from "../../DesignToken";

export interface SearchType {
  query: string;
  category: string | undefined;
}

export interface ProductType {
  category: string;
  description: string;
  discountPercentage: number;
  hasDiscount: boolean;
  id: number;
  images: string;
  name: string;
  price: number;
  stock: number;
  username: string;
}

function HomePage() {
  const user = useSelector((state: RootState) => state.user);
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [cart, setCart] = useState<any>([]);

  const token = useDesignToken();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const fetchCart = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL!}/api/cart/${user?.id}`,
      config
    );
    setCart(response.data);
  };

  const searchProducts = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/products/search?name=${query}&category=${category}&page=${page}&size=5`,
        config
      );
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setPage((prev) => (prev == 0 ? 0 : prev - 1));
  };

  const [form] = Form.useForm();

  useEffect(() => {
    searchProducts();
    if (user.role === "ROLE_BUYER") {
      fetchCart();
    }
  }, [page, query, category]);

  const categoryOptions = [
    { label: "IT", value: "IT" },
    { label: "Fashion", value: "Fashion" },
    { label: "Beauty", value: "Beauty" },
    { label: "Home", value: "Home" },
    { label: "Health", value: "Health" },
    { label: "Others", value: "Others" },
  ];

  const onFinish = (values: SearchType) => {
    setQuery(values.query);
    setCategory(values.category || "");
  };

  const SearchBar = () => {
    return (
      <Form
        form={form}
        onFinish={onFinish}
        layout="inline"
        style={{
          paddingBottom: "40px",
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Form.Item label="Query" name="query">
          <Input placeholder="Search" />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Category"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={categoryOptions}
          />
        </Form.Item>

        <Form.Item>
          <Button type="link" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: token.colorTextWhite,
        }}
      >
        <HeroBanner />
        <Flex
          vertical
          align="center"
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: 40,
            height: "100vh",
          }}
        >
          <SearchBar />
          <Row gutter={16} justify="start" style={{ width: "100%" }}>
            {products.map((product: any, key: number) => (
              <Col key={key}>
                <ProductCard product={product} user={user} cartId={cart?.id} />
              </Col>
            ))}
          </Row>
          <Flex style={{ paddingTop: 30, gap: 10 }}>
            <Button onClick={prevPage} disabled={page === 0}>
              Previous Page
            </Button>
            <Button onClick={nextPage} disabled={page === totalPages - 1}>
              Next Page
            </Button>
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
}

export default HomePage;
