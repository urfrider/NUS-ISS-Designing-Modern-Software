import { ShopOutlined } from "@ant-design/icons";
import { RootState } from "../../redux/store";
import { Typography, Card, Button, Tag, Spin } from "antd";
import axios from "axios";
import { get } from "http";
import { parse } from "path";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";

const { Title, Text } = Typography;

function OrderFulfilment() {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);

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
    } finally {
      setLoading(false);
    }
  };

  const getBuyerIdByOrderId = async (orderId: number) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getAddressByBuyerId = async (buyerId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/address/${buyerId}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch address:", error);
    } finally {
      setLoading(false);
    }
  };

  const shipOrder = async (orderId: string) => {
    try {
      const itemsToShip = orders.filter(
        (order: any) =>
          order.orderId === parseInt(orderId) && order.status === "PENDING"
      );
      await Promise.all(
        itemsToShip.map((item: any) =>
          axios.post(
            `${import.meta.env.VITE_API_URL}/api/order-items/${item.id}/next`,
            {},
            config
          )
        )
      );
      await fetchOrders(); // Refresh the orders after shipping
    } catch (error) {
      console.error("Failed to ship order:", error);
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
    } catch (error) {
      console.error("Failed to generate shipping label:", error);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        <ShopOutlined style={{ marginRight: 12 }} />
        Your Orders
      </Title>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "2rem auto" }} />
      ) : (
        <>
          <div style={{ marginBottom: "2rem" }}>
            <Title level={3}>Pending Shipment</Title>
            {Object.keys(groupedOrders.pending).length > 0 ? (
              Object.entries(groupedOrders.pending).map(
                ([orderId, items]: any) => (
                  <Card
                    key={orderId}
                    title={`Order ID - ${orderId}`}
                    style={{ marginBottom: "1rem" }}
                    extra={
                      <>
                        <Button
                          type="primary"
                          onClick={() => shipOrder(orderId)}
                          style={{ marginRight: "1rem" }}
                        >
                          Ship This Order
                        </Button>
                        <Button
                          type="default"
                          onClick={() => printShippingLabel(orderId)}
                        >
                          Print Shipping Label
                        </Button>
                      </>
                    }
                  >
                    {items.map((item: any) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <div>
                          <Text strong>
                            Product Name: {getProductName(item.productId)}
                          </Text>
                          <p>Product ID: {item.productId}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </Card>
                )
              )
            ) : (
              <p>No pending shipments.</p>
            )}
          </div>

          <div>
            <Title level={3}>Completed / Cancelled Orders</Title>
            {Object.keys(groupedOrders.completed).length > 0 ? (
              Object.entries(groupedOrders.completed).map(
                ([orderId, items]: any) => (
                  <Card
                    key={orderId}
                    title={`Order ID - ${orderId}`}
                    style={{ marginBottom: "1rem" }}
                    extra={
                      <Tag
                        color={
                          getOrderStatus(items) === "DELIVERED"
                            ? "green"
                            : getOrderStatus(items) === "CANCELLED"
                            ? "red"
                            : "orange"
                        }
                      >
                        {getOrderStatus(items)}
                      </Tag>
                    }
                  >
                    {items.map((item: any) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <div>
                          <p>Product Name: {getProductName(item.productId)}</p>
                          <p>Product ID: {item.productId}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </Card>
                )
              )
            ) : (
              <p>No completed orders.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
export default OrderFulfilment;
