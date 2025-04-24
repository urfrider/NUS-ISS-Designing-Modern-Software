import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import ProductCard from "../Product/ProductCard";
import { Button, Col, Empty, Flex, Input, Layout, Row, TabsProps } from "antd";
import { Content } from "antd/es/layout/layout";

import HeroBanner from "../../components/HeroBanner/HeroBanner";
import { useDesignToken } from "../../DesignToken";
import CustomTabs from "../../components/custom/CustomTabs/CustomTabs";

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
    console.log("category", category);
    console.log("query", query);

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

  useEffect(() => {
    searchProducts();
    if (user.role === "ROLE_BUYER") {
      fetchCart();
    }
  }, [page, query, category]);

  const categoryOptionsMap = {
    "0": "All",
    "1": "IT",
    "2": "Fashion",
    "3": "Beauty",
    "4": "Home",
    "5": "Health",
    "6": "Others",
  };

  const onFinish = (values: SearchType) => {
    setQuery(values.query);
    setCategory(values.category || "");
  };

  const onChange = (key: string) => {
    if (key !== "0") {
      const catagory =
        categoryOptionsMap[key as keyof typeof categoryOptionsMap];
      onFinish({
        category: catagory,
        query: "",
      });
    } else {
      onFinish({
        category: "",
        query: "",
      });
    }
  };

  const onSearch = (value: string) => {
    console.log("value searching", value);
    setQuery(value);
  };

  const allTab = {
    key: "0",
    label: "All",
    children: (
      <>
        <Row justify={"center"}>
          <Input.Search
            placeholder="Search"
            onSearch={onSearch}
            style={{ width: 200, marginBottom: 16 }}
          />
        </Row>
        <Row
          gutter={32}
          justify="start"
          style={{ width: "100%", padding: "32px 64px" }}
          wrap={true}
        >
          {products.length === 0 ? (
            <Col span={24} style={{ textAlign: "center", margin: "32px 0" }}>
              <Empty description="No products in this catagory" />
            </Col>
          ) : (
            products.map((product: any, index: number) => (
              <Col key={index}>
                <ProductCard product={product} user={user} cartId={cart?.id} />
              </Col>
            ))
          )}
        </Row>
      </>
    ),
  };

  const items: TabsProps["items"] = [
    allTab,
    ...Object.entries(categoryOptionsMap)
      .filter(([key]) => key !== "0")
      .map(([key, label]) => ({
        key,
        label,
        children: (
          <>
            <Row justify={"center"}>
              <Input.Search
                placeholder="Search"
                onSearch={onSearch}
                style={{ width: 200, marginBottom: 16 }}
              />
            </Row>

            <Row
              gutter={32}
              justify="start"
              style={{ width: "100%", padding: "32px 64px" }}
              wrap={true}
            >
              {products.filter((product) => product.category === label)
                .length === 0 ? (
                <Col
                  span={24}
                  style={{ textAlign: "center", margin: "32px 0" }}
                >
                  <Empty description="No products in this catagory" />
                </Col>
              ) : (
                products
                  .filter((product) => product.category === label)
                  .map((product: any, index: number) => (
                    <Col key={index}>
                      <ProductCard
                        product={product}
                        user={user}
                        cartId={cart?.id}
                      />
                    </Col>
                  ))
              )}
            </Row>
          </>
        ),
      })),
  ];

  // const SearchBar = () => {
  //   return (
  //     <Form
  //       form={form}
  //       onFinish={onFinish}
  //       layout="inline"
  //       style={{
  //         paddingBottom: "40px",
  //         width: "100%",
  //         display: "flex",
  //         justifyContent: "flex-start",
  //       }}
  //     >
  //       <Form.Item label="Query" name="query">
  //         <Input placeholder="Search" />
  //       </Form.Item>

  //       <Form.Item label="Category" name="category">
  //         <Select
  //           showSearch
  //           style={{ width: 200 }}
  //           placeholder="Category"
  //           optionFilterProp="label"
  //           filterSort={(optionA, optionB) =>
  //             (optionA?.label ?? "")
  //               .toLowerCase()
  //               .localeCompare((optionB?.label ?? "").toLowerCase())
  //           }
  //           options={categoryOptions}
  //         />
  //       </Form.Item>

  //       <Form.Item>
  //         <Button type="link" htmlType="submit">
  //           Search
  //         </Button>
  //       </Form.Item>
  //     </Form>
  //   );
  // };

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
          <CustomTabs
            defaultActiveKey="0"
            items={items}
            onChange={onChange}
            centered
          />

          <Flex style={{ gap: 10, marginTop: 16 }}>
            <Button onClick={prevPage} disabled={page === 0} type="link">
              Previous Page
            </Button>
            <Button
              onClick={nextPage}
              disabled={page === totalPages - 1}
              type="link"
            >
              Next Page
            </Button>
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
}

export default HomePage;
