import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/userSlice";
import { BUYER } from "../../constants/constants";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  Layout,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  BookOutlined,
  ContactsOutlined,
  DollarOutlined,
  RobotOutlined,
  LogoutOutlined,
  EditOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { useDesignToken } from "../../DesignToken";

function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useDesignToken();

  const onLogout = () => {
    dispatch(logout(user));
    navigate("/");
  };

  const onEditProfile = () => {
    navigate("/editProfile");
  };

  const onViewOrders = () => {
    navigate("/orders");
  };

  const onViewProducts = () => {
    if (user.role !== BUYER) {
      navigate("/sellerProducts");
    }
  };

  const { Title, Text, Paragraph } = Typography;

  // Generate user initials for avatar
  const getInitials = () => {
    return user.username ? user.username.charAt(0).toUpperCase() : "U";
  };

  // Convert role to readable format with icon
  const getRoleDisplay = () => {
    if (user.role === BUYER) {
      return (
        <Space>
          <ShoppingOutlined style={{ color: token.colorPrimary }} />
          <Text>Buyer</Text>
        </Space>
      );
    }
    return (
      <Space>
        <ShopOutlined style={{ color: token.colorOrange }} />
        <Text>Seller</Text>
      </Space>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgBase }}>
      <Content
        style={{
          padding: "40px 24px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={22} lg={20} xl={18}>
            <Card
              bordered={false}
              style={{
                borderRadius: token.borderRadiusMed,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Header Section */}
              <Flex
                align="center"
                justify="space-between"
                style={{ marginBottom: 24 }}
              >
                <Title level={2} style={{ margin: 0 }}>
                  My Profile
                </Title>
                <Flex gap={12}>
                  <Button onClick={onLogout} icon={<LogoutOutlined />}>
                    Log Out
                  </Button>
                  <Button
                    type="primary"
                    onClick={onEditProfile}
                    icon={<EditOutlined />}
                    style={{ background: token.colorPrimary }}
                  >
                    Edit Profile
                  </Button>
                </Flex>
              </Flex>

              <Divider style={{ margin: "12px 0 32px" }} />

              {/* User Info Section */}
              <Row gutter={[32, 32]}>
                {/* Left Column - Avatar and Basic Info */}
                <Col xs={24} md={8}>
                  <Flex vertical align="center" gap={16}>
                    <Avatar
                      size={120}
                      style={{
                        backgroundColor: token.colorPrimary,
                        fontSize: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getInitials()}
                    </Avatar>

                    <div style={{ textAlign: "center" }}>
                      <Title level={3} style={{ marginBottom: 4 }}>
                        {user.username}
                      </Title>
                      {getRoleDisplay()}
                    </div>

                    {/* Stats */}
                    <Card
                      style={{
                        width: "100%",
                        marginTop: 16,
                        borderRadius: token.borderRadiusMed,
                      }}
                    >
                      <Statistic
                        title="Balance"
                        value={user.balance}
                        precision={2}
                        prefix={<DollarOutlined />}
                        suffix="SGD"
                        style={{ textAlign: "center" }}
                        valueStyle={{ color: token.colorPrimary }}
                      />
                    </Card>

                    {/* Action Buttons */}
                    <Flex
                      vertical
                      style={{ width: "100%", gap: 12, marginTop: 8 }}
                    >
                      <Button
                        block
                        icon={<ShoppingOutlined />}
                        onClick={onViewOrders}
                      >
                        My Orders
                      </Button>

                      {user.role !== BUYER && (
                        <Button
                          block
                          icon={<ShopOutlined />}
                          onClick={onViewProducts}
                        >
                          My Products
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                </Col>

                {/* Right Column - Details */}
                <Col xs={24} md={16}>
                  <Card
                    title={
                      <Flex align="center" gap={8}>
                        <UserOutlined />
                        <span>Account Details</span>
                      </Flex>
                    }
                    style={{ borderRadius: token.borderRadiusMed }}
                  >
                    {/* <Descriptions
                      column={{ xs: 1, sm: 1, md: 1 }}
                      bordered
                      size="middle"
                      labelStyle={{
                        fontWeight: "bold",
                        width: 120,
                      }}
                    >
                      <Descriptions.Item
                        label="Username"
                        labelStyle={{ color: token.colorTextBaseSecondary }}
                      >
                        <Flex align="center" gap={8}>
                          <RobotOutlined
                            style={{ color: token.colorPrimary }}
                          />
                          <Text>{user.username} hello</Text>
                        </Flex>
                      </Descriptions.Item>

                      <Descriptions.Item
                        label="Role"
                        labelStyle={{ color: token.colorTextBaseSecondary }}
                      >
                        <Flex align="center" gap={8}>
                          <ContactsOutlined
                            style={{ color: token.colorPrimary }}
                          />
                          <Text>
                            {user.role === BUYER ? "Buyer" : "Seller"}
                          </Text>
                        </Flex>
                      </Descriptions.Item>

                      <Descriptions.Item
                        label={user.role === BUYER ? "Address" : "UEN"}
                        labelStyle={{ color: token.colorTextBaseSecondary }}
                      >
                        <Flex align="center" gap={8}>
                          <BookOutlined style={{ color: token.colorPrimary }} />
                          <Text>
                            {user.role === BUYER ? user.address : user.uen}
                          </Text>
                        </Flex>
                      </Descriptions.Item>

                      <Descriptions.Item
                        label="Balance"
                        labelStyle={{ color: token.colorTextBaseSecondary }}
                      >
                        <Flex align="center" gap={8}>
                          <DollarOutlined
                            style={{ color: token.colorPrimary }}
                          />
                          <Text>${user.balance?.toFixed(2)}</Text>
                        </Flex>
                      </Descriptions.Item>
                    </Descriptions> */}
                    <Card
                      title="Username"
                      style={{
                        borderRadius: token.borderRadiusSmall,
                      }}
                      size="small"
                    >
                      <Paragraph>
                        {user.username || "No shipping address provided."}
                      </Paragraph>
                    </Card>{" "}
                    <Card
                      title="Role"
                      style={{
                        marginTop: 24,
                        borderRadius: token.borderRadiusSmall,
                      }}
                      size="small"
                    >
                      <Paragraph>
                        {user.role === BUYER ? "Buyer" : "Seller"}
                      </Paragraph>
                    </Card>{" "}
                    {user.role === BUYER ? (
                      <Card
                        title="Shipping Information"
                        style={{
                          marginTop: 24,
                          borderRadius: token.borderRadiusSmall,
                        }}
                        size="small"
                      >
                        <Paragraph>
                          {user.address || "No shipping address provided."}
                        </Paragraph>
                      </Card>
                    ) : (
                      <Card
                        title="Seller Information"
                        style={{
                          marginTop: 24,
                          borderRadius: token.borderRadiusSmall,
                        }}
                        size="small"
                      >
                        <Paragraph>
                          <strong>UEN:</strong> {user.uen || "Not provided"}
                        </Paragraph>
                      </Card>
                    )}
                  </Card>

                  {/* Account Privacy & Security */}
                  <Card
                    title="Account Security"
                    style={{
                      marginTop: 24,
                      borderRadius: token.borderRadiusMed,
                    }}
                    extra={
                      <Button type="link" onClick={onEditProfile}>
                        Update
                      </Button>
                    }
                  >
                    <Flex align="center" justify="space-between">
                      <Text>Password</Text>
                      <Text type="secondary">••••••••</Text>
                    </Flex>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Profile;
