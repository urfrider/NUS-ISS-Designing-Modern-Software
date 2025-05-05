import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import {
  Radio,
  Input,
  List,
  Space,
  Divider,
  Badge,
  Form,
  Flex,
  Layout,
  Typography,
} from "antd";
import {
  CreditCardOutlined,
  DollarOutlined,
  PayCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  SafetyOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useDesignToken } from "../../DesignToken";
import CustomTypography from "../../components/custom/CustomTypography/CustomTypography";
import CustomCard from "../../components/custom/CustomCard/CustomCard";
import CustomButton from "../../components/custom/CustomButton/CustomButton";
import { Content } from "antd/es/layout/layout";

const { Title, Text } = CustomTypography;
const { Text: AntText } = Typography;

const Checkout = () => {
  const user = useSelector((state: RootState) => state.user);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [creditCardHolder, setCreditCardHolder] = useState("");
  const [creditCardExpiry, setCreditCardExpiry] = useState("");
  const [creditCardCVC, setCreditCardCVC] = useState("");
  const [cart, setCart] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = useDesignToken();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL!}/api/cart/${user?.id}`,
        config
      );
      setCart(response.data);
    } catch (error) {
      toast.error("Failed to fetch cart items");
      console.error(error);
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);

    var data: any = {
      username: user?.username,
      cartId: cart?.id,
    };

    if (paymentMethod == "creditCard") {
      data["cardNumber"] = creditCardNumber;
      data["cardHolder"] = creditCardHolder;
      data["cardExpiry"] = creditCardExpiry;
      data["cardCvc"] = creditCardCVC;
    } else if (paymentMethod == "paypal") {
      data["paypalEmail"] = paypalEmail;
    }

    await makePayment(data);
    await sendNotification();
    // navigate("/cart");
  };

  useEffect(() => {
    fetchCart();
  }, []);

  async function makePayment(data: any) {
    try {
      // Use the actual discounted total for payment
      await axios.post(
        `${import.meta.env.VITE_API_URL!}/api/payment`,
        {
          paymentType: paymentMethod,
          amount: calculateOrderSummary().total,
          details: data,
        },
        config
      );
      toast.success(
        `Payment successful with ${getPaymentMethodName(paymentMethod)}`
      );
      navigate("/orders");
    } catch (e) {
      toast.error("Payment failed. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendNotification() {
    for (const item of cart.items) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL!}/notif/createNotification`,
          {
            senderId: user.id,
            message: `An order for '${item.name}' has been placed!`,
            type: "ORDER_CREATED",
            createdAt: new Date().toISOString(),
            isRead: false,
            reciepientId: item.sellerId,
          },
          config
        );
      } catch (e) {
        console.log(e);
      }
    }
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "cash":
        return "Cash Balance";
      case "paypal":
        return "PayPal";
      case "creditCard":
        return "Credit Card";
      default:
        return method;
    }
  };

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

    cart.items.forEach((item: any) => {
      const originalItemTotal = item.price * item.quantity;
      subtotal += originalItemTotal;

      const discountedItemPrice = item.hasDiscount
        ? item.price * ((100 - item.discountPercentage) / 100)
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

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgWhite }}>
      <Content
        style={{
          padding: "24px",
          width: "1200px",
          margin: "0 auto",
        }}
      >
        <CustomButton
          type="link"
          onClick={() => navigate("/cart")}
          icon={<ArrowLeftOutlined />}
          style={{ marginBottom: 16, position: "absolute", left: 85.5 }}
        >
          Back to Cart
        </CustomButton>
        <Title level={2} style={{ textAlign: "center" }}>
          Checkout
        </Title>

        <Flex justify="center" gap={24} style={{ marginTop: 40 }}>
          <CustomCard
            title={<Title level={4}>Order Summary</Title>}
            style={{
              background: token.colorBgWhite,
              borderRadius: token.borderRadiusMed,
              width: "50%",
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={cart?.items || []}
              renderItem={(item: any) => {
                const originalPrice = item.price;
                const discountedPrice = item.hasDiscount
                  ? item.price * ((100 - item.discountPercentage) / 100)
                  : item.price;
                const originalItemTotal = originalPrice * item.quantity;
                const discountedItemTotal = discountedPrice * item.quantity;

                return (
                  <List.Item actions={[<Text strong>x{item?.quantity}</Text>]}>
                    <List.Item.Meta
                      title={
                        <Flex align="center" gap={8}>
                          {item.name}
                          {/* {item.hasDiscount && (
                            <AntText
                              style={{
                                backgroundColor: token.colorError,
                                color: token.colorBgWhite,
                                fontSize: token.fontSizeSmall,
                                padding: "2px 8px",
                                borderRadius: token.borderRadiusSmall,
                              }}
                            >
                              {item.discountPercentage}% OFF
                            </AntText>
                          )} */}
                        </Flex>
                      }
                      description={
                        item.hasDiscount ? (
                          <Space>
                            <AntText
                              delete
                              type="secondary"
                              style={{ fontSize: token.fontSizeSmall }}
                            >
                              ${originalPrice.toFixed(2)} each
                            </AntText>
                            <AntText style={{ color: token.colorError }}>
                              ${discountedPrice.toFixed(2)} each
                            </AntText>
                          </Space>
                        ) : (
                          <Text type="secondary">
                            ${discountedPrice.toFixed(2)} each
                          </Text>
                        )
                      }
                    />
                    <div>
                      {item.hasDiscount ? (
                        <Space direction="vertical" size={0} align="end">
                          <AntText
                            delete
                            type="secondary"
                            style={{ fontSize: token.fontSizeSmall }}
                          >
                            ${originalItemTotal.toFixed(2)}
                          </AntText>
                          <AntText
                            style={{
                              color: token.colorError,
                              fontWeight: "bold",
                            }}
                          >
                            ${discountedItemTotal.toFixed(2)}
                          </AntText>
                        </Space>
                      ) : (
                        `$${discountedItemTotal.toFixed(2)}`
                      )}
                    </div>
                  </List.Item>
                );
              }}
              footer={
                <div>
                  <Divider style={{ margin: "12px 0" }} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Text>Subtotal:</Text>
                    <Text>${orderSummary.subtotal.toFixed(2)}</Text>
                  </div>

                  {orderSummary.savings > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ color: token.colorError }}>Savings:</Text>
                      <Text style={{ color: token.colorError }}>
                        -${orderSummary.savings.toFixed(2)}
                      </Text>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Text>Shipping:</Text>
                    <Text>Free</Text>
                  </div>

                  <Divider style={{ margin: "12px 0" }} />

                  <div className="flex justify-between">
                    <Text strong>Total:</Text>
                    <Text strong>${orderSummary.total.toFixed(2)}</Text>
                  </div>
                </div>
              }
              locale={{ emptyText: "Your cart is empty" }}
            />
          </CustomCard>

          <CustomCard
            title={<Title level={4}>Payment Method</Title>}
            style={{
              background: token.colorBgWhite,
              borderRadius: token.borderRadiusMed,
              width: "30%",
            }}
          >
            <Form layout="vertical">
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Radio value="cash">
                    <Space>
                      <DollarOutlined style={{ color: token.colorSuccess }} />
                      <span>Cash Balance</span>
                      <Badge
                        count={`$${user.balance?.toFixed(2)}`}
                        style={{
                          backgroundColor: token.colorPrimary,
                          fontWeight: "normal",
                        }}
                      />
                    </Space>
                  </Radio>

                  <Radio value="paypal">
                    <Space>
                      <PayCircleOutlined style={{ color: "#0070BA" }} />
                      <span>PayPal</span>
                    </Space>
                  </Radio>

                  {paymentMethod === "paypal" && (
                    <Form.Item style={{ margin: "0 0 16px 24px" }}>
                      <Input
                        placeholder="Email address"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        style={{ width: "100%" }}
                        prefix={<UserOutlined />}
                      />
                    </Form.Item>
                  )}

                  <Radio value="creditCard">
                    <Space>
                      <CreditCardOutlined
                        style={{ color: token.colorOrange }}
                      />
                      <span>Credit Card</span>
                    </Space>
                  </Radio>

                  {paymentMethod === "creditCard" && (
                    <div style={{ margin: "0 0 16px 24px" }}>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Form.Item style={{ marginBottom: 12 }}>
                          <Input
                            placeholder="Card Number"
                            value={creditCardNumber}
                            onChange={(e) =>
                              setCreditCardNumber(e.target.value)
                            }
                            prefix={<CreditCardOutlined />}
                            maxLength={19}
                          />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 12 }}>
                          <Input
                            placeholder="Cardholder Name"
                            value={creditCardHolder}
                            onChange={(e) =>
                              setCreditCardHolder(e.target.value)
                            }
                            prefix={<UserOutlined />}
                          />
                        </Form.Item>
                        <div className="grid grid-cols-2 gap-4">
                          <Form.Item style={{ marginBottom: 12 }}>
                            <Input
                              placeholder="MM/YY"
                              value={creditCardExpiry}
                              onChange={(e) =>
                                setCreditCardExpiry(e.target.value)
                              }
                              prefix={<CalendarOutlined />}
                              maxLength={5}
                            />
                          </Form.Item>
                          <Form.Item style={{ marginBottom: 0 }}>
                            <Input
                              placeholder="CVC"
                              value={creditCardCVC}
                              onChange={(e) => setCreditCardCVC(e.target.value)}
                              prefix={<SafetyOutlined />}
                              maxLength={4}
                            />
                          </Form.Item>
                        </div>
                      </Space>
                    </div>
                  )}
                </Space>
              </Radio.Group>

              <Divider />

              <CustomButton
                type="primary"
                size="large"
                block
                onClick={handlePlaceOrder}
                loading={isLoading}
                disabled={
                  (paymentMethod === "paypal" && !paypalEmail) ||
                  (paymentMethod === "creditCard" &&
                    (!creditCardNumber ||
                      !creditCardHolder ||
                      !creditCardExpiry ||
                      !creditCardCVC)) ||
                  !cart?.items?.length
                }
                style={{
                  backgroundColor: token.colorPrimary,
                  height: 50,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Pay ${orderSummary.total.toFixed(2) || "0.00"}
              </CustomButton>
            </Form>
          </CustomCard>
        </Flex>
      </Content>
    </Layout>
  );
};

export default Checkout;
