import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import axios from "axios";
import {
  Typography,
  Row,
  Col,
  InputNumber,
  Divider,
  Space,
  Layout,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDesignToken } from "../../DesignToken";
import { CartItemType } from "../../types/CartTypes";
import CustomButton from "../../components/custom/CustomButton/CustomButton";
import CustomCard from "../../components/custom/CustomCard/CustomCard";
import CustomTable from "../../components/custom/CustomTable/CustomTable";
import { Content } from "antd/es/layout/layout";

const { Title, Text } = Typography;

interface TableCartItem extends CartItemType {
  productId: string;
  key?: string;
  variant?: string;
  itemTotal: number;
}

const Cart = () => {
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

  console.log(cart);

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

  const removeItem = async (record: any) => {
    //todo: wait for kim to reply i need the itemid to send it back
    const data = {
      cartId: cart?.id,
      username: user?.username,
      productId: record?.id,
      quantity: record?.quantity,
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
      console.log(`Item ${record?.id} removed successfully`);
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
            {record.hasDiscount && (
              <Text
                style={{
                  backgroundColor: token.colorError,
                  color: token.colorBgWhite,
                  fontSize: token.fontSizeSmall,
                  padding: "2px 8px",
                  borderRadius: token.borderRadiusSmall,
                  display: "inline-block",
                }}
              >
                {record.discountPercentage}% OFF
              </Text>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      render: (price: number, record: any) =>
        record.hasDiscount ? (
          <Space direction="vertical" size={0}>
            <Text
              delete
              type="secondary"
              style={{ fontSize: token.fontSizeSmall }}
            >
              ${record.originalPrice.toFixed(2)}
            </Text>
            <Text style={{ color: token.colorError, fontWeight: "bold" }}>
              ${price.toFixed(2)}
            </Text>
          </Space>
        ) : (
          `$${price.toFixed(2)}`
        ),
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
      render: (itemTotal: number, record: any) =>
        record.hasDiscount ? (
          <Space direction="vertical" size={0}>
            <Text
              delete
              type="secondary"
              style={{ fontSize: token.fontSizeSmall }}
            >
              ${(record.originalPrice * record.quantity).toFixed(2)}
            </Text>
            <Text style={{ color: token.colorError, fontWeight: "bold" }}>
              ${itemTotal}
            </Text>
          </Space>
        ) : (
          `$${itemTotal}`
        ),
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: any) => (
        <CustomButton
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record)}
        />
      ),
    },
  ];

  const tableData =
    cart?.items?.map((item: TableCartItem, index: number) => {
      const originalPrice = item.price;
      const discountedPrice = item.hasDiscount
        ? item.price * ((100 - item.discountPercentage!) / 100)
        : item.price;

      return {
        key: index,
        id: item.productId,
        name: item.name,
        variant: item.variant || "",
        originalPrice: originalPrice,
        price: discountedPrice,
        quantity: item.quantity,
        image: item.images,
        hasDiscount: item.hasDiscount,
        discountPercentage: item.discountPercentage,
        itemTotal: (discountedPrice * item.quantity).toFixed(2) ?? 0,
      };
    }) || [];

  console.log("tableData", tableData);

  const handleMoveToCheckout = () => {
    navigate("/checkout");
  };

  const allowMoveToCheckout: boolean = useMemo(() => {
    return cart?.items?.length !== 0;
  }, [cart]);

  // Calculate order summary with consideration for discounts
  const calculateOrderSummary = () => {
    if (!cart?.items || cart.items.length === 0) {
      return {
        subtotal: 0,
        savings: 0,
        total: 0,
      };
    }

    let subtotal = 0;
    let discountedTotal = 0;

    cart.items.forEach((item: TableCartItem) => {
      const originalItemTotal = item.price * item.quantity;
      subtotal += originalItemTotal;

      const discountedItemPrice = item.hasDiscount
        ? item.price * ((100 - item.discountPercentage!) / 100)
        : item.price;
      discountedTotal += discountedItemPrice * item.quantity;
    });

    return {
      subtotal: subtotal,
      savings: subtotal - discountedTotal,
      total: discountedTotal,
    };
  };

  const orderSummary = calculateOrderSummary();

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
                <Text>${orderSummary.subtotal.toFixed(2)}</Text>
              </div>

              {orderSummary.savings > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: token.colorError }}>Savings</Text>
                  <Text style={{ color: token.colorError }}>
                    -${orderSummary.savings.toFixed(2)}
                  </Text>
                </div>
              )}

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

              <CustomButton
                type="link"
                style={{ padding: 0, marginBottom: 10 }}
              >
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
                <Text strong>${orderSummary.total.toFixed(2)}</Text>
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
      </Content>
    </Layout>
  );
};

export default Cart;
