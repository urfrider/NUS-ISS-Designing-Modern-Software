import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import { Table, Card, Button, Space, Divider, Empty, Tag, Tooltip } from "antd";
import {
  ShoppingOutlined,
  CalendarOutlined,
  DollarOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useDesignToken } from "../../DesignToken";
import CustomTypography from "../../components/custom/CustomTypography/CustomTypography";

const { Title, Text } = CustomTypography;

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

const PastOrders = () => {
  const token = useDesignToken();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/buyer/${user.id}`,
          config
        );

        const formattedOrders = response.data.map((order: any) => ({
          ...order,
          orderDate: order.orderDate || new Date().toISOString(),
          status: order.status || "Completed",
          items: order.items || [],
        }));

        setOrders(formattedOrders);
      } catch (error) {
        toast.error("Failed to load orders");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return token.colorSuccess;
      case "processing":
        return token.colorBlue;
      case "pending":
        return token.colorWarning;
      case "cancelled":
        return token.colorError;
      default:
        return token.colorPrimary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: number) => <Text>#{id}</Text>,
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date: string) => (
        <Space>
          <CalendarOutlined style={{ color: token.colorBlue }} />
          <Text>{formatDate(date)}</Text>
        </Space>
      ),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <Space>
          <DollarOutlined style={{ color: token.colorOrange }} />
          <Text strong>${amount?.toFixed(2)}</Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={getStatusColor(status)}
          style={{
            borderRadius: "16px",
            padding: "2px 12px",
            fontSize: "14px",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: (_: any, record: Order) => (
        <Tooltip title="Order Details">
          <Button
            type="text"
            shape="circle"
            icon={<RightOutlined />}
            onClick={() => {
              const key = String(record.id);
              if (expandedRowKeys.includes(key)) {
                setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
              } else {
                setExpandedRowKeys([...expandedRowKeys, key]);
              }
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const expandedRowRender = (record: Order) => {
    const itemColumns = [
      {
        title: "Product",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        render: (price: number) => `$${price.toFixed(2)}`,
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Total",
        key: "total",
        render: (text: string, item: OrderItem) =>
          `$${(item.price * item.quantity).toFixed(2)}`,
      },
    ];

    return (
      <div style={{ padding: "0 20px 20px" }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          Order Items
        </Title>
        <Table
          columns={itemColumns}
          dataSource={record.items}
          pagination={false}
          size="small"
          rowKey="id"
          style={{ marginBottom: 16 }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            style={{ backgroundColor: token.colorPrimary }}
            onClick={() => navigate(`/order/${record.id}`)}
          >
            View Full Details
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={2}>
          {/* <ShoppingOutlined style={{ marginRight: 12 }} /> */}
          Your Orders
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          View and manage all your past orders
        </Text>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          expandable={{
            expandedRowRender,
            expandedRowKeys,
            onExpand: (expanded, record) => {
              const key = String(record.id);
              if (expanded) {
                setExpandedRowKeys([...expandedRowKeys, key]);
              } else {
                setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
              }
            },
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} orders`,
            style: { marginTop: 16 },
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" align="center" size="middle">
                    <Text type="secondary">No orders found</Text>
                    <Button
                      type="primary"
                      onClick={() => navigate("/home")}
                      style={{ backgroundColor: token.colorPrimary }}
                    >
                      Continue Shopping
                    </Button>
                  </Space>
                }
              />
            ),
          }}
        />
      </Card>

      <Divider />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          icon={<ShoppingOutlined />}
          onClick={() => navigate("/home")}
          size="large"
          style={{ marginRight: 16 }}
        >
          Continue Shopping
        </Button>
        <Button
          type="primary"
          onClick={() => navigate("/cart")}
          size="large"
          style={{ backgroundColor: token.colorPrimary }}
        >
          View Cart
        </Button>
      </div>
    </div>
  );
};

export default PastOrders;
