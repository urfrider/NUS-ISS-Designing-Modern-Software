import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RootState } from "../../redux/store";
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
  Empty,
  Spin,
  Image,
  Layout,
} from "antd";
import {
  ShoppingOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useDesignToken } from "../../DesignToken";
import moment from "moment";
import { toast } from "react-toastify";
import { ProductType } from "../Product/ProductReviews";
import CustomCard from "../../components/custom/CustomCard/CustomCard";
import CustomTable from "../../components/custom/CustomTable/CustomTable";
import { Content } from "antd/es/layout/layout";

const { Title, Text } = Typography;

function Orders() {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productDetails, setProductDetails] = useState<{
    [key: string]: ProductType;
  }>({});
  const [loadingProducts, setLoadingProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const token = useDesignToken();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/buyer/${user.id}`,
          config
        );
        setOrders(response.data);

        // Fetch product details for all products in orders
        const productIds = new Set();
        response.data.forEach((order: any) => {
          if (order.orderItems && order.orderItems.length > 0) {
            order.orderItems.forEach((item: any) => {
              if (item.productId) {
                productIds.add(item.productId);
              }
            });
          }
        });

        // Fetch details for each product
        productIds.forEach((productId: any) => {
          fetchProductDetails(productId);
        });
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchProductDetails = async (productId: string) => {
    if (!productId) return;

    try {
      setLoadingProducts((prev) => ({ ...prev, [productId]: true }));
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}`,
        config
      );
      setProductDetails((prev) => ({
        ...prev,
        [productId]: response.data,
      }));
    } catch (error) {
      toast.error(`Failed to fetch details for product ${productId}`);
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [productId]: false }));
    }
  };

  useEffect(() => {
    console.log("productDetails", productDetails);
  }, [productDetails]);

  const getOrderStatusTag = (status: string) => {
    console.log("status", status);
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Completed
          </Tag>
        );
      case "processing":
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Processing
          </Tag>
        );
      case "shipped":
        return (
          <Tag icon={<InboxOutlined />} color="cyan">
            Shipped
          </Tag>
        );
      case "pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Pending
          </Tag>
        );
      default:
        return <Tag color="default">{status || "N/A"}</Tag>;
    }
  };

  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <Text strong>{id}</Text>,
    },
    {
      title: "DATE",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Space>
          {/* <CalendarOutlined /> */}
          <span>{moment(date).format("MMM DD, YYYY")}</span>
        </Space>
      ),
    },
    {
      title: "TOTAL",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <Space>
          {/* <DollarOutlined /> */}
          <Text strong>${amount?.toFixed(2)}</Text>
        </Space>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getOrderStatusTag(status),
    },
    // {
    //   title: "ACTION",
    //   key: "action",
    //   render: (_: any, record: any) => (
    //     <Button
    //       type="primary"
    //       size="small"
    //       onClick={() => navigate(`/order/${record.id}`)}
    //       style={{ backgroundColor: token.colorPrimary }}
    //     >
    //       View Details
    //     </Button>
    //   ),
    // },
  ];

  const expandedRowRender = (record: any) => {
    return (
      <CustomCard bordered={false} style={{ background: "#f9f9f9" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text type="secondary">Payment Method:</Text>{" "}
            <Text strong>{record.paymentMethod || "N/A"}</Text>
          </div>

          <Divider orientation="left" plain>
            <Text type="secondary">Order Items</Text>
          </Divider>

          <Table
            dataSource={record.orderItems}
            pagination={false}
            showHeader={true}
            columns={[
              {
                title: "Product",
                dataIndex: "productId",
                key: "product",
                render: (productId: string) => {
                  const product = productDetails[productId];
                  return (
                    <Space>
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: "#f0f0f0",
                          display: "inline-block",
                          overflow: "hidden",
                        }}
                      >
                        {loadingProducts[productId] ? (
                          <Spin size="small" />
                        ) : product?.images && product.images.length > 0 ? (
                          <Image
                            src={`data:image/png;base64,${product.images}`}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            preview={false}
                          />
                        ) : (
                          <InboxOutlined style={{ fontSize: 24, margin: 18 }} />
                        )}
                      </div>
                      <div>
                        <div>
                          <Text strong>
                            {loadingProducts[productId] ? (
                              <Spin size="small" />
                            ) : product ? (
                              <Button
                                type="link"
                                onClick={() => {
                                  navigate(`/product/${productId}`);
                                }}
                                style={{ padding: 0 }}
                              >
                                {product.name}
                              </Button>
                            ) : (
                              `Product ID: ${productId}`
                            )}
                          </Text>
                        </div>
                        {product?.category && (
                          <div style={{ color: "#888" }}>
                            {product.category}
                          </div>
                        )}
                      </div>
                    </Space>
                  );
                },
              },
              {
                title: "Price",
                dataIndex: "price",
                key: "price",
                render: (price: number) => `$${price?.toFixed(2)}`,
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                key: "quantity",
                render: (quantity: number) => <Text> {quantity}</Text>,
              },
              {
                title: "Total",
                dataIndex: "total",
                key: "total",
                render: (_: any, item: any) => (
                  <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
                ),
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status: string) => getOrderStatusTag(status),
              },
            ]}
          />

          {record.shippingAddress && (
            <>
              <Divider orientation="left" plain>
                <Text type="secondary">Shipping Details</Text>
              </Divider>
              <div>
                <Text type="secondary">Address:</Text>{" "}
                <Text>{record.shippingAddress}</Text>
              </div>
            </>
          )}
        </Space>
      </CustomCard>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgWhite }}>
      <Content
        style={{
          padding: "24px",
          width: "1200px",
          margin: "0 auto",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
          <ShoppingOutlined style={{ marginRight: 12 }} />
          Your Orders
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <CustomCard style={{ marginBottom: 24 }}>
              <Statistic
                title="Total Orders"
                value={orders.length}
                prefix={<InboxOutlined />}
              />
            </CustomCard>
          </Col>
          <Col xs={24} md={18}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Spin size="large" />
              </div>
            ) : orders.length > 0 ? (
              <CustomTable
                columns={columns}
                dataSource={orders}
                rowKey={(record) => record.id.toString()}
                expandable={{ expandedRowRender }}
                pagination={{ pageSize: 5 }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span>You haven't placed any orders yet</span>}
              >
                <Button
                  type="primary"
                  onClick={() => navigate("/home")}
                  style={{ backgroundColor: token.colorPrimary }}
                >
                  Start Shopping
                </Button>
              </Empty>
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

// Helper component for the statistics cards
const Statistic = ({
  title,
  value,
  prefix,
}: {
  title: string;
  value: number;
  prefix: React.ReactNode;
}) => {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>
        {prefix} {value}
      </div>
      <div style={{ color: "#888" }}>{title}</div>
    </div>
  );
};

export default Orders;
