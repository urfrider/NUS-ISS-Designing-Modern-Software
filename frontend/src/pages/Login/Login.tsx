import { useState } from "react";
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

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState(BUYER);

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
      const user = await onLogin(values); //backend must return values ? eh but if it works it works ah
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
      toast.error("Login Unsuccessful")
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
      console.log(user);
      dispatch(login(user));
      navigate("/home");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#EDF0FF",
        }}
      >
        <Flex
          vertical
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            paddingLeft: 30,
            paddingRight: 30,
            width: "30%",
          }}
        >
          <Typography.Title
            level={3}
            style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}
          >
            Welcome to Moly Market!
          </Typography.Title>
          <Flex vertical>
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
                      <Radio value={BUYER}>Buyer</Radio>
                      <Radio value={SELLER}>Seller</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <Input placeholder="Username" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirm"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The new password that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm Password" />
                  </Form.Item>

                  <Form.Item
                    label={role === BUYER ? "Address" : "UEN"}
                    name={role === BUYER ? "address" : "uen"}
                    rules={[
                      {
                        required: true,
                        message:
                          role === BUYER
                            ? "Please enter your address!"
                            : "Please enter your UEN!",
                      },
                    ]}
                    style={{ marginBottom: 10 }}
                  >
                    <Input
                      value={role === BUYER ? "address" : "uen"}
                      placeholder={role === BUYER ? "Address" : "UEN"}
                    />
                  </Form.Item>

                  <Flex gap={4} style={{ marginBottom: 20 }}>
                    <Typography>Already have an account?</Typography>
                    <Typography.Link
                      onClick={() => {
                        setIsRegister((prev) => !prev);
                      }}
                    >
                      Login here
                    </Typography.Link>
                  </Flex>

                  <Flex justify="center">
                    <Form.Item label={null}>
                      <Button type="primary" htmlType="submit">
                        Register
                      </Button>
                    </Form.Item>
                  </Flex>
                </Flex>
              ) : (
                <Flex vertical>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Username"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                    style={{ marginBottom: 10 }}
                  >
                    <Input.Password
                      placeholder="Password"
                    />
                  </Form.Item>

                  <Flex gap={4} style={{ marginBottom: 20 }}>
                    <Typography>Don't have an account yet?</Typography>
                    <Typography.Link
                      onClick={() => {
                        setIsRegister((prev) => !prev);
                      }}
                    >
                      Register here
                    </Typography.Link>
                  </Flex>

                  <Flex justify="center">
                    <Form.Item label={null}>
                      <Button type="primary" htmlType="submit">
                        Log in
                      </Button>
                    </Form.Item>
                  </Flex>
                </Flex>
              )}
            </Form>
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
}

export default Login;