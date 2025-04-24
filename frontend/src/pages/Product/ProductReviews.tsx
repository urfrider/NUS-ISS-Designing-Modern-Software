import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Layout,
  Typography,
  Flex,
  Divider,
  Card,
  Rate,
  Form,
  Input,
  Button,
  Empty,
  Space,
  Select,
  Avatar,
  Tooltip,
  Skeleton,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDesignToken } from "../../DesignToken";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ReviewType {
  id?: number;
  buyer: number;
  product: number;
  content: string;
  rating: number;
  buyerUsername?: string;
}

export interface ProductType {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPercentage: number;
  hasDiscount: boolean;
  stock: number;
  username: string;
  images: string;
}

interface BuyerProfile {
  id: number;
  username: string;
  address?: string;
}

const ProductReviews = () => {
  const location = useLocation();
  const { user, product: initialProduct } = location.state || {};
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [product, setProduct] = useState<ProductType | null>(
    initialProduct || null
  );
  const [buyerProfiles, setBuyerProfiles] = useState<
    Record<number, BuyerProfile>
  >({});
  const [loadingProfiles, setLoadingProfiles] = useState<boolean>(false);
  const [form] = Form.useForm();
  const token = useDesignToken();

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
      "Content-Type": "application/json",
    },
  };

  const fetchProductDetails = async () => {
    if (!product?.id) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${product.id}`,
        config
      );
      setProduct(response.data);
    } catch (error) {
      toast.error("Failed to fetch product details.");
    }
  };

  const addReview = async (values: { rating: number; content: string }) => {
    if (!user?.id || !product?.id) {
      toast.error("User or product information missing.");
      return;
    }

    const review: ReviewType = {
      buyer: user.id,
      product: product.id,
      rating: values.rating,
      content: values.content,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reviews/write`,
        review,
        config
      );
      toast.success("Review written successfully!");
      form.resetFields();
      fetchReviews();
    } catch (error) {
      toast.error("Failed to add review.");
    }
  };

  const fetchReviews = async () => {
    if (!product?.id) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews/product/${product.id}`,
        config
      );
      const data = response.data.reverse();
      setReviews(data);

      // Fetch buyer profiles for all unique buyer IDs
      const uniqueBuyerIds = [
        ...new Set((data as ReviewType[]).map((review) => review.buyer)),
      ];
      fetchBuyerProfiles(uniqueBuyerIds);
    } catch (error) {
      toast.error("Failed to fetch reviews.");
    }
  };

  const fetchBuyerProfiles = async (buyerIds: number[]) => {
    if (!buyerIds.length) return;

    setLoadingProfiles(true);

    try {
      // Create a map to track which profiles we've already fetched
      const missingBuyerIds = buyerIds.filter((id) => !buyerProfiles[id]);

      if (missingBuyerIds.length === 0) {
        setLoadingProfiles(false);
        return;
      }

      // Fetch profiles for all missing buyer IDs
      const buyerProfilePromises = missingBuyerIds.map((buyerId) =>
        axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/auth/buyerProfile?buyerId=${buyerId}`,
          config
        )
      );

      const results = await Promise.allSettled(buyerProfilePromises);

      // Process successful results
      const newProfiles: Record<number, BuyerProfile> = { ...buyerProfiles };

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const buyerId = missingBuyerIds[index];
          newProfiles[buyerId] = result.value.data;
        }
      });

      setBuyerProfiles(newProfiles);
    } catch (error) {
      console.error("Error fetching buyer profiles:", error);
      toast.error("Failed to fetch some buyer profiles.");
    } finally {
      setLoadingProfiles(false);
    }
  };

  // Get username for a buyer ID
  const getBuyerUsername = (buyerId: number) => {
    if (buyerProfiles[buyerId]) {
      return buyerProfiles[buyerId].username;
    }
    return null;
  };

  useEffect(() => {
    if (product?.id) {
      fetchProductDetails();
      fetchReviews();
    }
  }, [product?.id]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

  // Get first letter of username for avatar
  const getInitial = (username: string | null) => {
    if (!username) return "?";
    return username.charAt(0).toUpperCase();
  };

  if (!product) {
    return (
      <Layout style={{ minHeight: "100vh", background: token.colorBgBase }}>
        <Content style={{ padding: 24 }}>
          <Empty description="Product not found" />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgBase }}>
      <Content style={{ padding: "24px 64px" }}>
        <Flex vertical gap={24}>
          <Title level={2} style={{ color: token.colorTextBase }}>
            {product.name} - Reviews
          </Title>

          <Flex gap={32} style={{ width: "100%" }}>
            {/* Left Section: Product Details */}
            <Flex vertical style={{ flex: 1 }}>
              <Card
                style={{
                  borderRadius: token.borderRadiusMed,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Flex vertical gap={16}>
                  <Flex justify="center">
                    <img
                      style={{
                        maxHeight: 300,
                        objectFit: "contain",
                        borderRadius: token.borderRadiusSmall,
                      }}
                      src={`data:image/png;base64,${product.images}`}
                      alt={product.name}
                    />
                  </Flex>

                  <Divider style={{ margin: "16px 0" }} />

                  <Flex vertical gap={8}>
                    <Title level={4} style={{ margin: 0 }}>
                      {product.name}
                    </Title>

                    <Flex align="center" gap={8}>
                      <Rate
                        disabled
                        value={calculateAverageRating()}
                        allowHalf
                        style={{ fontSize: 16, color: token.colorPrimary }}
                      />
                      <Text>{calculateAverageRating()} out of 5</Text>
                    </Flex>

                    <Text type="secondary">Category: {product.category}</Text>

                    <Paragraph style={{ marginTop: 8 }}>
                      {product.description}
                    </Paragraph>

                    <Flex gap={16} align="center">
                      <Text
                        strong
                        style={{
                          fontSize: token.fontSizeLg,
                          color: token.colorTextBase,
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </Text>

                      {product.hasDiscount && (
                        <Text delete type="secondary">
                          $
                          {(
                            product.price +
                            (product.price * product.discountPercentage) / 100
                          ).toFixed(2)}
                        </Text>
                      )}

                      {product.hasDiscount && (
                        <Text
                          style={{
                            color: token.colorError,
                            fontSize: token.fontSizeSmall,
                          }}
                        >
                          {product.discountPercentage}% OFF
                        </Text>
                      )}
                    </Flex>

                    <Text type="secondary">
                      Stock: {product.stock} available
                    </Text>
                  </Flex>
                </Flex>
              </Card>

              <Card
                title="Write a Review"
                style={{
                  marginTop: 24,
                  borderRadius: token.borderRadiusMed,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Form form={form} onFinish={addReview} layout="vertical">
                  <Form.Item
                    name="rating"
                    label="Your Rating"
                    rules={[
                      { required: true, message: "Please rate this product" },
                    ]}
                  >
                    <Select placeholder="Select a rating">
                      <Select.Option value={1}>Poor</Select.Option>
                      <Select.Option value={2}>Fair</Select.Option>
                      <Select.Option value={3}>Good</Select.Option>
                      <Select.Option value={4}>Very Good</Select.Option>
                      <Select.Option value={5}>Excellent</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="content"
                    label="Your Review"
                    rules={[
                      { required: true, message: "Please write your review" },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Share your experience with this product..."
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        backgroundColor: token.colorPrimary,
                      }}
                    >
                      Submit Review
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Flex>

            {/* Right Section: Reviews */}
            <Flex vertical style={{ flex: 1 }}>
              <Card
                title={
                  <Flex justify="space-between" align="center">
                    <Title level={4} style={{ margin: 0 }}>
                      Customer Reviews
                    </Title>
                    <Text>
                      {reviews.length}{" "}
                      {reviews.length === 1 ? "Review" : "Reviews"}
                    </Text>
                  </Flex>
                }
                style={{
                  borderRadius: token.borderRadiusMed,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  height: "100%",
                }}
              >
                {reviews.length > 0 ? (
                  <Flex vertical gap={16}>
                    {reviews.map((review, index) => (
                      <Card
                        key={index}
                        style={{
                          backgroundColor: token.colorBgBase,
                          borderRadius: token.borderRadiusSmall,
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        <Flex vertical gap={8}>
                          <Flex align="center" gap={8}>
                            <Rate
                              disabled
                              value={review.rating}
                              style={{
                                fontSize: 16,
                                color: token.colorPrimary,
                              }}
                            />
                            <Flex align="center" gap={8}>
                              <Avatar
                                style={{
                                  backgroundColor: token.colorPrimary,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                size="small"
                                icon={
                                  !getBuyerUsername(review.buyer) && (
                                    <UserOutlined />
                                  )
                                }
                              >
                                {getBuyerUsername(review.buyer) &&
                                  getInitial(getBuyerUsername(review.buyer))}
                              </Avatar>

                              {loadingProfiles &&
                              !getBuyerUsername(review.buyer) ? (
                                <Skeleton.Button
                                  active
                                  size="small"
                                  style={{ width: 80, height: 16 }}
                                />
                              ) : (
                                <Tooltip title={`User ID: ${review.buyer}`}>
                                  <Text>
                                    {getBuyerUsername(review.buyer) ||
                                      `Buyer ${review.buyer}`}
                                  </Text>
                                </Tooltip>
                              )}
                            </Flex>
                          </Flex>

                          <Paragraph style={{ margin: "8px 0 0" }}>
                            {review.content}
                          </Paragraph>
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                ) : (
                  <Empty
                    description="No reviews yet. Be the first to review this product!"
                    style={{ margin: "32px 0" }}
                  />
                )}
              </Card>
            </Flex>
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
};

export default ProductReviews;
