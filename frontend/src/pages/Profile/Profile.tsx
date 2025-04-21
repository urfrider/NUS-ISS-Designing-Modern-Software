import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice";
import { BUYER } from "../../constants/constants";
import { Button, Flex, Layout, List, Typography } from "antd";
import {
  BookOutlined,
  ContactsOutlined,
  DollarOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";

function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout(user));
    navigate("/");
  };

  const onEditProfile = () => {
    navigate("/editProfile");
  };

  const data = [
    {
      icon: <RobotOutlined />,
      sublist: [{ title: "Username", description: user.username }],
    },
    {
      icon: <DollarOutlined />,
      sublist: [
        {
          title: "Balance",
          description: user.balance,
        },
      ],
    },
    {
      icon: <ContactsOutlined />,
      sublist: [
        {
          title: "Role",
          description: user.role === BUYER ? "Buyer" : "Seller",
        },
      ],
    },
    {
      icon: <BookOutlined />,
      sublist: [
        {
          title: user.role === BUYER ? "Address" : "UEN",
          description: user.role === BUYER ? user.address : user.uen,
        },
      ],
    },
  ];

  const { Text } = Typography;

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
          align="center"
          style={{
            width: "700px",
            backgroundColor: "white",
            padding: 40,
            borderRadius: "10px",
          }}
        >
          <Typography.Title level={3}>My Profile</Typography.Title>
          <Flex justify="center">
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta avatar={item.icon} />
                  <List
                    itemLayout="vertical"
                    dataSource={item.sublist}
                    renderItem={(subitem) => (
                      <List.Item style={{ width: "500px", maxWidth: "500px" }}>
                        <Text strong>{subitem.title}</Text>
                        <Typography>{subitem.description}</Typography>
                      </List.Item>
                    )}
                  ></List>
                </List.Item>
              )}
            />
          </Flex>
          <Flex gap={80}>
            <Button onClick={onLogout}>Log Out</Button>
            <Button type="primary" onClick={onEditProfile}>
              Edit
            </Button>
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
}

export default Profile;
