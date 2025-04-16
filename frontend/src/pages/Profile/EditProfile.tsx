import { useState } from "react";
import { RootState } from "../../redux/store";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { BUYER } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../redux/userSlice";
import { Button, Flex, Form, Input, Layout, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { RegisterType } from "../Login/Login";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [id] = useState(user.id);
  const [username] = useState(user.username);
  const [address] = useState(user.address || "");
  const [uen] = useState(user.uen || "");
  const [role] = useState(user.role || "");

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const [form] = Form.useForm();

  const onFinish = (values: RegisterType) => {
    onSave(values);
    form.resetFields();
  };

  const onSave = async (values: RegisterType) => {
    try {
      const updatedAddress = values.address;
      const updatedUen = values.uen;
      const response =
        role == BUYER
          ? await axios.post(
              `${import.meta.env.VITE_API_URL!}/auth/buyerProfile`,
              {
                id,
                username,
                address: updatedAddress,
              },
              config
            )
          : await axios.post(
              `${import.meta.env.VITE_API_URL!}/auth/sellerProfile`,
              {
                id,
                username,
                uen: updatedUen,
              },
              config
            );
      toast.success("Profile updated successfully!");

      const updatedUserData =
        role == BUYER ? { address: updatedAddress } : { uen: updatedUen };

      dispatch(updateUser(updatedUserData));
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
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Flex vertical>
                <Form.Item label="Username" name="username">
                  <Input placeholder={username} disabled />
                </Form.Item>

                <Form.Item
                  label="Role"
                  name="role"
                  initialValue={role === BUYER ? "Buyer" : "Seller"}
                >
                  <Input disabled />
                </Form.Item>

                {role === BUYER ? (
                  <Form.Item
                    label="Address"
                    name="address"
                    initialValue={address}
                  >
                    <Input />
                  </Form.Item>
                ) : (
                  <Form.Item label="UEN" name="uen" initialValue={uen}>
                    <Input />
                  </Form.Item>
                )}

                <Flex justify="center" gap={80} style={{ paddingTop: 10 }}>
                  <Form.Item>
                    <Button onClick={handleCancel}>Cancel</Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save Changes
                    </Button>
                  </Form.Item>
                </Flex>
              </Flex>
            </Form>
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
}

export default EditProfile;