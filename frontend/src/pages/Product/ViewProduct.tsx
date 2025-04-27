import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  Col,
  Row,
  Typography,
  Layout,
  Input,
  Select,
  Statistic,
  Card,
  Space,
  Breadcrumb,
  Badge,
  Spin,
  Empty,
  Pagination,
  Button,
  Flex,
  Alert,
  Divider,
  Tag,
} from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  ShopOutlined,
  DollarOutlined,
  TagOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDesignToken } from "../../DesignToken";

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

interface ProductType {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  images: string;
  hasDiscount: boolean;
  discountPercentage: number;
  username: string;
}

export const ViewProduct = () => {
  const user = useSelector((state: RootState) => state.user);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const token = useDesignToken();

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/seller/${user.id}`,
        config
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to load products. Please try again.");
      setLoading(false);
    }
  };

  // Apply all filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category === categoryFilter);
    }

    // Apply stock filter
    if (stockFilter === "inStock") {
      result = result.filter((product) => product.stock > 0);
    } else if (stockFilter === "lowStock") {
      result = result.filter(
        (product) => product.stock > 0 && product.stock <= 5
      );
    } else if (stockFilter === "outOfStock") {
      result = result.filter((product) => product.stock === 0);
    }

    // Apply sorting
    if (sortBy === "priceAsc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "nameAsc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "nameDesc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "stockAsc") {
      result.sort((a, b) => a.stock - b.stock);
    } else if (sortBy === "stockDesc") {
      result.sort((a, b) => b.stock - a.stock);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, categoryFilter, sortBy, stockFilter, products]);

  // Initial data load
  useEffect(() => {
    getProducts();
  }, []);

  // Get categories from products for filter dropdown
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;
  const outOfStockCount = products.filter(
    (product) => product.stock === 0
  ).length;

  // Calculate pagination
  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const addNewProduct = () => {
    navigate("/products/add");
  };

  const handleRefresh = () => {
    getProducts();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setSortBy("newest");
    setStockFilter("all");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgWhite }}>
      {/* <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Products</Breadcrumb.Item>
      </Breadcrumb> */}

      <Content
        style={{
          padding: "64px",
          width: 1200,
          margin: "0 auto",
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 16 }}
        >
          <Typography.Title level={3} style={{ margin: 0 }}>
            My Product Listings
          </Typography.Title>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={addNewProduct}
            >
              Add New Product
            </Button>
          </Space>
        </Flex>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Products"
                value={totalProducts}
                prefix={<AppstoreOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Inventory Value"
                value={totalValue}
                precision={2}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Low Stock Items"
                value={lowStockCount}
                valueStyle={{ color: "#faad14" }}
                prefix={<TagOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Out of Stock"
                value={outOfStockCount}
                valueStyle={{
                  color: outOfStockCount > 0 ? "#ff4d4f" : "#52c41a",
                }}
                prefix={<ShopOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" ghost onClick={handleRefresh}>
                Try Again
              </Button>
            }
          />
        )}

        {/* Filters */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[8, 16]}>
            <Col xs={24} md={8}>
              <Search
                placeholder="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col>
              <Select
                style={{ width: "100%" }}
                placeholder="Category"
                value={categoryFilter}
                onChange={(value) => setCategoryFilter(value)}
              >
                <Option value="all">All Categories</Option>
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={5}>
              <Select
                style={{ width: "100%" }}
                placeholder="Stock Status"
                value={stockFilter}
                onChange={(value) => setStockFilter(value)}
              >
                <Option value="all">All Stock</Option>
                <Option value="inStock">In Stock</Option>
                <Option value="lowStock">Low Stock (≤5)</Option>
                <Option value="outOfStock">Out of Stock</Option>
              </Select>
            </Col>
            {/* <Col xs={12} md={5}>
              <Select
                style={{ width: "100%" }}
                placeholder="Sort By"
                value={sortBy}
                onChange={(value) => setSortBy(value)}
              >
                <Option value="newest">Newest</Option>
                <Option value="priceAsc">Price: Low to High</Option>
                <Option value="priceDesc">Price: High to Low</Option>
                <Option value="nameAsc">Name: A to Z</Option>
                <Option value="nameDesc">Name: Z to A</Option>
                <Option value="stockAsc">Stock: Low to High</Option>
                <Option value="stockDesc">Stock: High to Low</Option>
              </Select>
            </Col> */}
            <Col xs={12} md={1}>
              <Button onClick={resetFilters}>Reset</Button>
            </Col>
          </Row>
        </Card>

        {/* Products Display */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Empty
            description="No products found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <>
            <Divider orientation="left">
              <Space>
                Products
                <Tag color="blue">{filteredProducts.length} items</Tag>
              </Space>
            </Divider>

            <Row
              gutter={[16, 24]}
              justify="center"
              style={{ marginBottom: 24 }}
            >
              {currentProducts.map((product, index) => (
                <Col key={index}>
                  <Badge.Ribbon
                    text={
                      product.stock === 0
                        ? "Out of stock"
                        : product.stock <= 5
                        ? "Low stock"
                        : null
                    }
                    color={product.stock === 0 ? "red" : "orange"}
                    style={{
                      display:
                        product.stock === 0 || product.stock <= 5
                          ? "block"
                          : "none",
                    }}
                  >
                    <ProductCard product={product} user={user} />
                  </Badge.Ribbon>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <Flex justify="center" style={{ marginTop: 16, marginBottom: 16 }}>
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                total={filteredProducts.length}
                pageSize={pageSize}
                showSizeChanger={false}
                showQuickJumper
              />
            </Flex>
          </>
        )}
      </Content>
    </Layout>
  );
};
