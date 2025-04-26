import { useState, useEffect, useMemo } from "react";
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
import { CartItemType } from "../../types/Cart";
import CustomButton from "../../components/custom/CustomButton/CustomButton";
import CustomCard from "../../components/custom/CustomCard/CustomCard";
import CustomTable from "../../components/custom/CustomTable/CustomTable";

const { Title, Text } = Typography;

interface TableCartItem extends CartItemType {
  id: string;
  key?: string;
  variant?: string;
  itemTotal: number;
}

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
    console.log("cart contents", response.data);
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
    //todo: wait for kim to reply i need the itemid to send it back
    const data = {
      cartId: cart?.id,
      username: user?.username,
      productId: itemId,
      quantity: 0,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL!}/api/cart/remove`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setCart(response.data);
      console.log(`Item ${itemId} removed successfully`);
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
                src={`data:image/png;base64,${record.image}`}
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
          disabled
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
      dataIndex: "itemTotal",
      key: "total",
      render: (itemTotal: number) => `$${itemTotal}`,
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: any) => (
        <CustomButton
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.id)}
        />
      ),
    },
  ];

  const tableData =
    cart?.items?.map((item: TableCartItem, index: number) => ({
      key: index,
      id: item.id,
      name: item.name,
      variant: item.variant || "",
      price: item.price,
      quantity: item.quantity,
      image: item.images,
      itemTotal: (item.price * item.quantity).toFixed(2) ?? 0,
    })) || [];

  console.log("tableData", tableData);

  const handleMoveToCheckout = () => {
    navigate("/checkout");
  };

  const allowMoveToCheckout: boolean = useMemo(() => {
    return cart?.items?.length !== 0;
  }, [cart]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        Your Cart
      </Title>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <CustomTable
            columns={columns}
            dataSource={tableData}
            pagination={false}
            locale={{ emptyText: "Your cart is empty" }}
          />
        </Col>

        <Col xs={24} lg={8}>
          <CustomCard title="Order Summary" style={{ marginBottom: 20 }}>
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

            <CustomButton type="link" style={{ padding: 0, marginBottom: 10 }}>
              Add coupon code
            </CustomButton>

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

            <CustomButton
              disabled={!allowMoveToCheckout}
              type="primary"
              block
              style={{
                marginTop: 10,
                backgroundColor: token.colorPrimary,
              }}
              onClick={() => {
                if (allowMoveToCheckout) {
                  handleMoveToCheckout();
                }
              }}
            >
              Checkout
            </CustomButton>
          </CustomCard>

          <Space>
            <CustomButton danger onClick={onClearCart}>
              Clear Cart
            </CustomButton>
            <CustomButton onClick={onUndo}>Undo</CustomButton>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default Cart;
