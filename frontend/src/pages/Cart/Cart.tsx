import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import axios from "axios";
import {
  Table,
  Card,
  Button,
  Typography,
  Row,
  Col,
  InputNumber,
  Divider,
  Space,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDesignToken } from "../../DesignToken";

const { Title, Text } = Typography;

function Cart() {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>([]);
  const token = useDesignToken();
  const fetchCart = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL!}/api/cart/${user?.id}`,
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    setCart(response.data);
  };

  const onClearCart = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL!}/api/cart/empty/${cart?.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setCart(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const onUndo = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL!}/api/cart/undo/${cart?.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setCart(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      console.log(`Update item ${itemId} to quantity ${quantity}`);
    } catch (e) {
      console.log(e);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      console.log(`Remove item ${itemId}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const columns = [
    {
      title: "PRODUCT",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space>
          <div
            style={{
              width: 60,
              height: 60,
              backgroundColor: "#f0f0f0",
              display: "inline-block",
            }}
          >
            {record.image && (
              <img
                src={record.image}
                alt={text}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
          <div>
            <div>{text}</div>
            <div style={{ color: "#888" }}>{record.variant}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record: any) => (
        <InputNumber
          min={1}
          max={10}
          defaultValue={quantity}
          onChange={(value) => updateQuantity(record.id, value as number)}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      key: "total",
      render: (text: string, record: any) =>
        `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.id)}
        />
      ),
    },
  ];

  const tableData =
    cart?.items?.map((item: any, index: number) => ({
      key: index,
      id: item.id,
      name: item.name,
      variant: item.variant || "",
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })) || [];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        Your Cart
      </Title>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            locale={{ emptyText: "Your cart is empty" }}
          />
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Order Summary" style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text>Subtotal</Text>
              <Text>${cart.totalAmount?.toFixed(2) || "0.00"}</Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text>Shipping</Text>
              <Text>Free</Text>
            </div>

            <Button type="link" style={{ padding: 0, marginBottom: 10 }}>
              Add coupon code
            </Button>

            <Divider style={{ margin: "10px 0" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text strong>Total</Text>
              <Text strong>${cart.totalAmount?.toFixed(2) || "0.00"}</Text>
            </div>

            <Button
              type="primary"
              block
              style={{
                marginTop: 10,
                backgroundColor: token.colorPrimary,
              }}
              onClick={() => navigate("/checkout")}
            >
              CHECKOUT
            </Button>
          </Card>

          <Space>
            <Button danger onClick={onClearCart}>
              Clear Cart
            </Button>
            <Button onClick={onUndo}>Undo</Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default Cart;
