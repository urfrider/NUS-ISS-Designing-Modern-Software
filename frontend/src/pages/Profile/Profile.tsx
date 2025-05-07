import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { logout, updateUser } from "../../redux/userSlice";
import { BUYER } from "../../constants/constants";
import {
  Avatar,
  Divider,
  Flex,
  Layout,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  Input,
  Form,
  message,
} from "antd";
import {
  DollarOutlined,
  LogoutOutlined,
  EditOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShopOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { useDesignToken } from "../../DesignToken";
import CustomButton from "../../components/custom/CustomButton/CustomButton";
import CustomCard from "../../components/custom/CustomCard/CustomCard";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useDesignToken();
  const [isTopupModalVisible, setTopupModalVisible] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");


  const onLogout = () => {
    dispatch(logout(user));
    navigate("/");
  };

  const onTopup = () => {
    setTopupModalVisible(true);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const topUp = async (data : any) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/buyerProfile?buyerId=${user.id}`,
        data,
        config
      );

      await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/buyerProfile?buyerId=${user.id}`,
        config
      );
      
    } catch (error) {
      toast.error("Error fetching product");
    }
  }

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
            <CustomCard>
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
                  <CustomButton
                    danger
                    onClick={onLogout}
                    icon={<LogoutOutlined />}
                  >
                    Log Out
                  </CustomButton>
                  <CustomButton
                    type="primary"
                    onClick={onEditProfile}
                    icon={<EditOutlined />}
                    style={{ background: token.colorPrimary }}
                  >
                    Edit Profile
                  </CustomButton>
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
                    <CustomCard
                      style={{
                        marginTop: 16,
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
                    </CustomCard>

                    {/* Action Buttons */}
                    <Flex
                      vertical
                      style={{ width: "100%", gap: 12, marginTop: 8 }}
                    >
                      {user.role == BUYER && (
                        <CustomButton
                          icon={<WalletOutlined />}
                          onClick={onTopup}
                        >
                          Top Up
                        </CustomButton>
                      )}

                      <CustomButton
                        icon={<ShoppingOutlined />}
                        onClick={onViewOrders}
                      >
                        My Orders
                      </CustomButton>

                      {user.role !== BUYER && (
                        <CustomButton
                          icon={<ShopOutlined />}
                          onClick={onViewProducts}
                        >
                          My Products
                        </CustomButton>
                      )}
                    </Flex>
                  </Flex>
                </Col>

                {/* Right Column - Details */}
                <Col xs={24} md={16}>
                  <CustomCard
                    title={
                      <Flex align="center" gap={8}>
                        <UserOutlined />
                        <span>Account Details</span>
                      </Flex>
                    }
                    style={{
                      borderRadius: token.borderRadiusMed,
                      background: token.colorBgWhite,
                    }}
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
                    <CustomCard
                      title="Username"
                      style={{
                        borderRadius: token.borderRadiusSmall,
                      }}
                      size="small"
                    >
                      <Paragraph>
                        {user.username || "No shipping address provided."}
                      </Paragraph>
                    </CustomCard>
                    <CustomCard
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
                    </CustomCard>{" "}
                    {user.role === BUYER ? (
                      <CustomCard
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
                      </CustomCard>
                    ) : (
                      <CustomCard
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
                      </CustomCard>
                    )}
                  </CustomCard>

                  {/* Account Privacy & Security */}
                  <CustomCard
                    title="Account Security"
                    style={{
                      marginTop: 24,
                      borderRadius: token.borderRadiusMed,
                    }}
                    extra={
                      <CustomButton type="link" onClick={onEditProfile}>
                        Update
                      </CustomButton>
                    }
                  >
                    <Flex align="center" justify="space-between">
                      <Text>Password</Text>
                      <Text type="secondary">••••••••</Text>
                    </Flex>
                  </CustomCard>
                </Col>
              </Row>
            </CustomCard>
          </Col>
        </Row>
      </Content>

      <Modal
        title="Top Up Balance"
        open={isTopupModalVisible}
        onOk={() => {
          const amount = parseFloat(topupAmount);
          if (isNaN(amount) || amount <= 0) {
            message.error("Please enter a valid amount.");
            return;
          }

          const newBalance = user.balance + amount;
          topUp({id:user.id, balance:newBalance});

          toast.success(`Successfully topped up SGD ${amount.toFixed(2)}. `);
          dispatch(updateUser({balance:newBalance}));
          setTopupModalVisible(false);
          setTopupAmount("");
        }}
        onCancel={() => {
          setTopupModalVisible(false);
          setTopupAmount("");
        }}
        okText="Top Up"
      >
        <Form layout="vertical">
          <Form.Item label="Amount (SGD)">
            <Input
              type="number"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default Profile;
