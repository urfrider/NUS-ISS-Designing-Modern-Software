import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RootState } from "../../redux/store";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Badge,
  Row,
  Col,
  Divider,
  Empty,
  Spin,
} from "antd";
import {
  ShoppingOutlined,
  CalendarOutlined,
  DollarOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useDesignToken } from "../../DesignToken";
import moment from "moment";

const { Title, Text } = Typography;

function Orders() {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        console.log("order response", response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getOrderStatusTag = (status: string) => {
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
          <CalendarOutlined />
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
          <DollarOutlined />
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
      <Card bordered={false} style={{ background: "#f9f9f9" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text type="secondary">Payment Method:</Text>{" "}
            <Text strong>{record.paymentMethod || "N/A"}</Text>
          </div>

          <Divider orientation="left" plain>
            <Text type="secondary">Order Items</Text>
          </Divider>

          <Table
            dataSource={record.items}
            pagination={false}
            showHeader={false}
            columns={[
              {
                title: "Product",
                dataIndex: "name",
                key: "name",
                render: (text: string, item: any) => (
                  <Space>
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        backgroundColor: "#f0f0f0",
                        display: "inline-block",
                      }}
                    >
                      {item.image && (
                        <img
                          src={`data:image/png;base64,${item.image}`}
                          alt={text}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <div>
                        <Text strong>{text}</Text>
                      </div>
                      {item.variant && (
                        <div style={{ color: "#888" }}>{item.variant}</div>
                      )}
                    </div>
                  </Space>
                ),
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
                render: (quantity: number) => (
                  <Badge
                    count={quantity}
                    style={{ backgroundColor: token.colorPrimary }}
                  />
                ),
              },
              {
                title: "Total",
                dataIndex: "total",
                key: "total",
                render: (_: any, item: any) => (
                  <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
                ),
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
      </Card>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        <ShoppingOutlined style={{ marginRight: 12 }} />
        Your Orders
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={6}>
          <Card style={{ marginBottom: 24 }}>
            <Statistic
              title="Total Orders"
              value={orders.length}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Card>
            {loading ? (
              <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Spin size="large" />
              </div>
            ) : orders.length > 0 ? (
              <Table
                columns={columns}
                dataSource={orders.map((order: any) => ({
                  ...order,
                  key: order.id,
                }))}
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
          </Card>
        </Col>
      </Row>
    </div>
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
