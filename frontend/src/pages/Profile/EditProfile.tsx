import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { updateUser } from "../../redux/userSlice";
import { BUYER } from "../../constants/constants";
import { useDesignToken } from "../../DesignToken";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Flex,
  Divider,
  Row,
  Col,
  Space,
  Avatar,
} from "antd";
import {
  UserOutlined,
  SaveOutlined,
  RollbackOutlined,
  ShoppingOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";

type FormValues = {
  address?: string;
  uen?: string;
};

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useDesignToken();
  const user = useSelector((state: RootState) => state.user);
  const [form] = Form.useForm();

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

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const onFinish = async (values: FormValues) => {
    try {
      const updateData =
        user.role === BUYER
          ? {
              id: user.id,
              username: user.username,
              address: values.address,
            }
          : {
              id: user.id,
              username: user.username,
              uen: values.uen,
            };

      const endpoint =
        user.role === BUYER
          ? `${import.meta.env.VITE_API_URL!}/auth/buyerProfile`
          : `${import.meta.env.VITE_API_URL!}/auth/sellerProfile`;

      const response = await axios.post(endpoint, updateData, config);

      const updatedUserData =
        user.role === BUYER ? { address: values.address } : { uen: values.uen };

      dispatch(updateUser(updatedUserData));
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    navigate("/profile");
  };

  const initialValues = {
    username: user.username,
    role: user.role === BUYER ? "Buyer" : "Seller",
    address: user.address || "",
    uen: user.uen || "",
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
                  Edit Profile
                </Title>
              </Flex>

              <Divider style={{ margin: "12px 0 32px" }} />

              {/* Form Section */}
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

                    <Paragraph type="secondary" style={{ textAlign: "center" }}>
                      Update your profile information below
                    </Paragraph>
                  </Flex>
                </Col>

                {/* Right Column - Edit Form */}
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
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={onFinish}
                      initialValues={initialValues}
                      style={{ maxWidth: "100%" }}
                    >
                      <Form.Item label="Username" name="username">
                        <Input disabled />
                      </Form.Item>

                      <Form.Item label="Role" name="role">
                        <Input disabled />
                      </Form.Item>

                      {user.role === BUYER ? (
                        <Form.Item
                          label="Shipping Address"
                          name="address"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your shipping address",
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={4}
                            placeholder="Enter your shipping address"
                          />
                        </Form.Item>
                      ) : (
                        <Form.Item
                          label="UEN (Unique Entity Number)"
                          name="uen"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your UEN",
                            },
                          ]}
                        >
                          <Input placeholder="Enter your UEN" />
                        </Form.Item>
                      )}

                      <Flex
                        justify="flex-end"
                        gap={16}
                        style={{ marginTop: 24 }}
                      >
                        <Button
                          onClick={handleCancel}
                          icon={<RollbackOutlined />}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          style={{ background: token.colorPrimary }}
                        >
                          Save Changes
                        </Button>
                      </Flex>
                    </Form>
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

export default EditProfile;
