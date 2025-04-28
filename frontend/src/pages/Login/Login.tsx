import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { BUYER, SELLER } from "../../constants/constants";
import {
  Button,
  Flex,
  Form,
  Input,
  Layout,
  Radio,
  RadioChangeEvent,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useDesignToken } from "../../DesignToken";
import CustomTypography from "../../components/custom/CustomTypography/CustomTypography";
import { validation } from "./validation";

export interface LoginType {
  username: string;
  password: string;
}

export interface RegisterType {
  role: string;
  username: string;
  password: string;
  address?: string;
  uen?: string;
}

function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState(BUYER);

  const token = useDesignToken();

  const handleRoleChange = (event: RadioChangeEvent) => {
    setRole(event.target.value);
  };

  const [form] = Form.useForm();

  const onRegister = async (values: RegisterType) => {
    try {
      const username = values.username;
      const password = values.password;
      const role = values.role;
      const uen = values.uen;
      const address = values.address;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL!}/auth/addNewUser`,
        role === BUYER
          ? {
              username,
              password,
              role,
              address,
            }
          : {
              username,
              password,
              role,
              uen,
            }
      );
      toast.success(response.data);
      const user = await onLogin(values);
      dispatch(login(user));
      navigate("/home");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const onLogin = async (values: LoginType) => {
    try {
      const username = values.username;
      const password = values.password;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL!}/auth/generateToken`,
        { username, password }
      );
      console.log("response", response);
      return response.data;
    } catch (e) {
      console.log("Login error", e);
      toast.error("Login Unsuccessful");
      return null;
    }
  };

  const onFinish = (values: LoginType | RegisterType) => {
    onSubmit(isRegister, values);
    form.resetFields();
  };

  const onSubmit = async (
    isRegister: boolean,
    values: LoginType | RegisterType
  ) => {
    if (isRegister) {
      await onRegister(values as RegisterType);
    } else {
      const user = await onLogin(values);
      if (user) {
        dispatch(login(user));
        navigate("/home");
      }
    }
  };

  useEffect(() => {
    const styleEl = document.createElement("style");

    const keyframes = `
      @keyframes floatCircle1 {
        0% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(10px, 15px) scale(1.05); }
        50% { transform: translate(0, 25px) scale(1); }
        75% { transform: translate(-10px, 10px) scale(0.95); }
        100% { transform: translate(0, 0) scale(1); }
      }
      
      @keyframes floatCircle2 {
        0% { transform: translate(0, 0) scale(1); }
        30% { transform: translate(-15px, -10px) scale(1.05); }
        60% { transform: translate(-7px, -20px) scale(0.95); }
        100% { transform: translate(0, 0) scale(1); }
      }
      
      .floating-circle-1 {
        animation: floatCircle1 20s ease-in-out infinite;
      }
      
      .floating-circle-2 {
        animation: floatCircle2 15s ease-in-out infinite;
      }
    `;

    styleEl.innerHTML = keyframes;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${token.colorOrange} 0%, ${token.colorPrimary} 100%)`,
        position: "relative",
      }}
    >
      <div
        className="floating-circle-1"
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          zIndex: 1,
        }}
      />
      <div
        className="floating-circle-2"
        style={{
          position: "absolute",
          bottom: "15%",
          right: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          zIndex: 1,
        }}
      />

      <Content
        style={{
          display: "flex",
          height: "100vh",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 10rem",
          }}
        >
          <CustomTypography.Title
            style={{
              color: token.colorTextWhite,
              fontSize: 64,
              margin: 0,
            }}
          >
            Moly Market
          </CustomTypography.Title>

          <CustomTypography.Title
            level={3}
            style={{
              color: token.colorTextWhite,
              fontWeight: "normal",
              // maxWidth: 600,
              margin: 0,
            }}
          >
            Your one-stop marketplace to buy and sell with confidence
          </CustomTypography.Title>
        </div>

        <div
          style={{
            width: "33.33%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Flex
            vertical
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "40px 30px",
              width: "80%",
              maxWidth: 400,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Typography.Title
              level={3}
              style={{
                textAlign: "center",
                marginTop: 0,
                marginBottom: 30,
                color: token.colorTextBase,
              }}
            >
              {isRegister ? "Create an Account" : "Welcome Back!"}
            </Typography.Title>

            <Form
              layout="vertical"
              initialValues={{ role: BUYER }}
              form={form}
              onFinish={onFinish}
            >
              {isRegister ? (
                <Flex vertical>
                  <Form.Item label="Role" name="role" required>
                    <Radio.Group onChange={handleRoleChange}>
                      <Radio value={BUYER} data-testid="buyer-radio">
                        Buyer
                      </Radio>
                      <Radio value={SELLER} data-testid="seller-radio">
                        Seller
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label="Username"
                    name="username"
                    rules={validation.username}
                  >
                    <Input placeholder="Username" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={validation.password}
                    hasFeedback
                  >
                    <Input.Password placeholder="Password" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirm"
                    dependencies={["password"]}
                    hasFeedback
                    rules={validation.confirmPassword}
                  >
                    <Input.Password
                      placeholder="Confirm Password"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label={role === BUYER ? "Address" : "UEN"}
                    name={role === BUYER ? "address" : "uen"}
                    rules={role === BUYER ? validation.address : validation.uen}
                    style={{ marginBottom: 24 }}
                  >
                    <Input
                      placeholder={role === BUYER ? "Address" : "UEN"}
                      size="large"
                    />
                  </Form.Item>

                  <Flex gap={4} style={{ marginBottom: 24 }}>
                    <Typography style={{ color: token.colorTextBase }}>
                      Already have an account?
                    </Typography>
                    <Typography.Link
                      onClick={() => {
                        setIsRegister((prev) => !prev);
                        form.resetFields();
                      }}
                      style={{ color: token.colorPrimary }}
                    >
                      Login here
                    </Typography.Link>
                  </Flex>

                  <Flex justify="center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{
                        backgroundColor: token.colorPrimary,
                        width: "100%",
                      }}
                      data-testid="register-button"
                    >
                      Register
                    </Button>
                  </Flex>
                </Flex>
              ) : (
                <Flex vertical>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={validation.username}
                  >
                    <Input placeholder="Username" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={validation.password}
                    style={{ marginBottom: 24 }}
                  >
                    <Input.Password placeholder="Password" size="large" />
                  </Form.Item>

                  <Flex gap={4} style={{ marginBottom: 24 }}>
                    <Typography style={{ color: token.colorTextBase }}>
                      Don't have an account yet?
                    </Typography>
                    <Typography.Link
                      onClick={() => {
                        setIsRegister((prev) => !prev);
                        form.resetFields();
                      }}
                      style={{ color: token.colorPrimary }}
                    >
                      Register here
                    </Typography.Link>
                  </Flex>

                  <Flex justify="center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{
                        backgroundColor: token.colorPrimary,
                        width: "100%",
                      }}
                    >
                      Log in
                    </Button>
                  </Flex>
                </Flex>
              )}
            </Form>
          </Flex>
        </div>
      </Content>
    </Layout>
  );
}

export default LandingPage;
