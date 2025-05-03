import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import {
  Layout,
  Typography,
  Divider,
  Flex,
  Spin,
  Empty,
  Space,
  Badge,
  Tabs,
  Row,
  Col,
} from "antd";
import { Content } from "antd/es/layout/layout";
import {
  ShopOutlined,
  InboxOutlined,
  PrinterOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TagOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useDesignToken } from "../../DesignToken";
import CustomCard from "../../components/custom/CustomCard/CustomCard";
import CustomTypography from "../../components/custom/CustomTypography/CustomTypography";
import CustomButton from "../../components/custom/CustomButton/CustomButton";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function OrderFulfillment() {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const token = useDesignToken();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order-items/seller/${user.id}`,
        config
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getBuyerIdByOrderId = async (orderId: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/seller/${user.id}`,
        config
      );
      const ordersBuyerId = response.data;
      for (const order of ordersBuyerId) {
        if (order.id == orderId) {
          return order.buyerId;
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to retrieve buyer information.");
    }
  };

  const getAddressByBuyerId = async (buyerId: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/address/${buyerId}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch address:", error);
      toast.error("Failed to retrieve shipping address.");
    }
  };

  const shipOrder = async (orderId: string) => {
    try {
      const itemsToShip = orders.filter(
        (order: any) =>
          order.orderId === parseInt(orderId) && order.status === "PENDING"
      );

      setLoading(true);
      await Promise.all(
        itemsToShip.map((item: any) =>
          axios.post(
            `${import.meta.env.VITE_API_URL}/api/order-items/${item.id}/next`,
            {},
            config
          )
        )
      );

      toast.success("Order has been shipped successfully!");
      await fetchOrders(); // Refresh the orders after shipping
    } catch (error) {
      console.error("Failed to ship order:", error);
      toast.error("Failed to ship order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/seller/${user.id}`,
        config
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const groupedOrders = orders.reduce(
    (acc: any, order: any) => {
      if (order.status === "PENDING") {
        acc.pending[order.orderId] = acc.pending[order.orderId] || [];
        acc.pending[order.orderId].push(order);
      } else {
        acc.completed[order.orderId] = acc.completed[order.orderId] || [];
        acc.completed[order.orderId].push(order);
      }
      return acc;
    },
    { pending: {}, completed: {} }
  );

  const getProductName = (productId: number) => {
    const product = products.find((p: any) => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  const getOrderStatus = (items: any[]) => {
    const uniqueStatuses = [...new Set(items.map((item: any) => item.status))];
    return uniqueStatuses.length === 1 ? uniqueStatuses[0] : "Mixed";
  };

  const getBuyerAddress = async (orderId: number) => {
    const buyerId = await getBuyerIdByOrderId(orderId);
    const address = await getAddressByBuyerId(buyerId);
    return address;
  };

  const printShippingLabel = async (orderId: number) => {
    try {
      setLoading(true);
      // Fetch the buyer's address
      const address = await getBuyerAddress(orderId);

      // Get the items for the order
      const items = orders.filter((order: any) => order.orderId == orderId);

      // Generate a random tracking ID
      const trackingId = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [100, 150], // Custom size for a shipping label
      });

      // Add a border for the label
      doc.setLineWidth(0.5);
      doc.rect(5, 5, 90, 140); // x, y, width, height

      // Add company details
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Moly Market Industries Pte Ltd", 10, 15);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("88 Moly Poly Road, S666088", 10, 20);

      // Add a horizontal line
      doc.setLineWidth(0.2);
      doc.line(5, 25, 95, 25); // x1, y1, x2, y2

      // Add recipient details
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Ship To:", 10, 35);
      doc.text(`Order ID: ${orderId}`, 10, 53);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(address, 10, 40, { maxWidth: 80 }); // Wrap text if too long

      // Add another horizontal line
      doc.line(5, 60, 95, 60);

      // Add tracking ID
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Tracking ID:", 10, 70);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(trackingId, 10, 75);

      // Add barcode
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, trackingId, {
        format: "CODE128",
        width: 2,
        height: 60,
      });
      const barcodeDataUrl = canvas.toDataURL("image/png");
      doc.addImage(barcodeDataUrl, "PNG", 10, 77, 80, 25); // x, y, width, height

      // Add a footer line
      doc.line(5, 106, 95, 106);

      // Add packing list
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Packing List:", 10, 115);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      let yPosition = 120; // Start position for the packing list
      items.forEach((item: any, index: number) => {
        const productName = getProductName(item.productId);

        // Check if the current position exceeds the page height
        if (yPosition > 135) {
          doc.addPage(); // Add a new page
          doc.setLineWidth(0.5);
          doc.rect(5, 5, 90, 140); // x, y, width, height

          yPosition = 15; // Reset yPosition for the new page
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text("Packing List (Continued):", 10, yPosition);
          yPosition += 5; // Move down for the next line
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
        }

        doc.text(
          `${index + 1}. ${productName} (Quantity: ${item.quantity})`,
          10,
          yPosition,
          { maxWidth: 80 }
        );
        yPosition += 5; // Move to the next line
      });

      // Save the PDF
      doc.save(`Shipping_Label_Order_${orderId}.pdf`);
      toast.success("Shipping label generated successfully!");
    } catch (error) {
      console.error("Failed to generate shipping label:", error);
      toast.error("Failed to generate shipping label. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return token.colorSuccess;
      case "CANCELLED":
        return token.colorError;
      case "PENDING":
        return token.colorWarning;
      default:
        return "cyan";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircleOutlined />;
      case "CANCELLED":
        return <CloseCircleOutlined />;
      case "PENDING":
        return <InboxOutlined />;
      default:
        return <TagOutlined />;
    }
  };

  const renderOrderItems = (items: any[]) => {
    return (
      <div style={{ marginTop: 12 }}>
        {items.map((item: any) => (
          <Flex
            key={item.id}
            align="center"
            justify="space-between"
            style={{
              padding: "12px",
              borderRadius: token.borderRadiusSmall,
              marginBottom: "12px",
              background: token.colorBgWhite,
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Flex vertical gap={4}>
              <CustomTypography.Text strong style={{ fontSize: 15 }}>
                {getProductName(item.productId)}
              </CustomTypography.Text>
              <Space size={16}>
                <CustomTypography.Text type="secondary">
                  ID: {item.productId}
                </CustomTypography.Text>
                <CustomTypography.Text>
                  <DollarOutlined style={{ marginRight: 4 }} />
                  <span style={{ fontWeight: 500 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </CustomTypography.Text>
              </Space>
            </Flex>
            <Text>x{item.quantity}</Text>
            {/* <Badge
              count={item.quantity}
              style={{
                backgroundColor: token.colorPrimary,
                fontSize: "12px",
                fontWeight: "bold",
                padding: "0 8px",
              }}
            /> */}
          </Flex>
        ))}
      </div>
    );
  };

  const renderPendingOrders = () => {
    const pendingOrders = Object.entries(groupedOrders.pending);

    if (pendingOrders.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No pending shipments"
          style={{ margin: "40px 0" }}
        />
      );
    }

    return pendingOrders.map(([orderId, items]: any) => (
      <CustomCard
        key={orderId}
        bordered={false}
        style={{
          marginBottom: 24,
          borderRadius: token.borderRadiusMed,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Flex justify="space-between" align="center">
          <CustomTypography.Title level={4} style={{ margin: 0 }}>
            Order #{orderId}
          </CustomTypography.Title>
          <Badge
            status="warning"
            text={
              <CustomTypography.Text
                style={{ fontSize: 14, color: token.colorWarning }}
              >
                Awaiting Shipment
              </CustomTypography.Text>
            }
          />
        </Flex>

        <Divider style={{ margin: "16px 0" }} />

        {renderOrderItems(items)}

        <Divider style={{ margin: "16px 0" }} />

        <Flex justify="flex-end" gap={12}>
          <CustomButton
            icon={<PrinterOutlined />}
            size="large"
            onClick={() => printShippingLabel(Number(orderId))}
          >
            Print Label
          </CustomButton>
          <CustomButton
            type="primary"
            icon={<RocketOutlined />}
            size="large"
            style={{ background: token.colorPrimary }}
            onClick={() => shipOrder(orderId)}
          >
            Ship Order
          </CustomButton>
        </Flex>
      </CustomCard>
    ));
  };

  const renderCompletedOrders = () => {
    const completedOrders = Object.entries(groupedOrders.completed);

    if (completedOrders.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No completed orders"
          style={{ margin: "40px 0" }}
        />
      );
    }

    return completedOrders.map(([orderId, items]: any) => {
      const status = getOrderStatus(items);

      return (
        <CustomCard
          key={orderId}
          bordered={false}
          style={{
            marginBottom: 24,
            borderRadius: token.borderRadiusMed,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Flex justify="space-between" align="center">
            <CustomTypography.Title level={4} style={{ margin: 0 }}>
              Order #{orderId}
            </CustomTypography.Title>
            <Badge
              status={status === "DELIVERED" ? "success" : "error"}
              text={
                <CustomTypography.Text
                  style={{
                    fontSize: 14,
                    color:
                      status === "DELIVERED"
                        ? token.colorSuccess
                        : token.colorError,
                  }}
                >
                  {status}
                </CustomTypography.Text>
              }
            />
          </Flex>

          <Divider style={{ margin: "16px 0" }} />

          {renderOrderItems(items)}

          <Divider style={{ margin: "16px 0" }} />

          <Flex justify="flex-end">
            <CustomButton
              icon={<PrinterOutlined />}
              size="large"
              onClick={() => printShippingLabel(Number(orderId))}
            >
              Print Label
            </CustomButton>
          </Flex>
        </CustomCard>
      );
    });
  };

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgBase }}>
      <Content
        style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <CustomCard
          bordered={false}
          style={{
            borderRadius: token.borderRadiusMed,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            minWidth: 850,
          }}
        >
          <Typography.Title
            level={3}
            style={{
              marginBottom: 24,
              color: token.colorTextBase,
              textAlign: "center",
            }}
          >
            <ShopOutlined style={{ marginRight: 12 }} />
            Order Fulfillment
          </Typography.Title>

          <Divider style={{ marginTop: 0 }} />

          {loading ? (
            <Flex justify="center" align="center" style={{ padding: "60px 0" }}>
              <Spin size="large" />
            </Flex>
          ) : (
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              type="card"
              style={{ marginTop: 16 }}
            >
              <TabPane
                tab={
                  <span>
                    <InboxOutlined style={{ marginRight: 8 }} />
                    Pending Shipment
                    {Object.keys(groupedOrders.pending).length > 0 && (
                      <Badge
                        count={Object.keys(groupedOrders.pending).length}
                        style={{
                          backgroundColor: token.colorWarning,
                          marginLeft: 8,
                        }}
                      />
                    )}
                  </span>
                }
                key="pending"
              >
                {renderPendingOrders()}
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <CheckCircleOutlined style={{ marginRight: 8 }} />
                    Completed Orders
                  </span>
                }
                key="completed"
              >
                {renderCompletedOrders()}
              </TabPane>
            </Tabs>
          )}
        </CustomCard>
      </Content>
    </Layout>
  );
}

export default OrderFulfillment;
