import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";
import { BUYER, SELLER } from "../constants/constants";
import {
  Layout,
  Typography,
  Menu,
  Badge,
  Space,
  Avatar,
  Divider,
  Flex,
} from "antd";
import {
  HomeOutlined,
  ShoppingOutlined,
  PlusCircleOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDesignToken } from "../DesignToken";

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const token = useDesignToken();

  const navToHome = () => {
    navigate("/home");
  };

  // Find active menu key based on current path
  const getActiveMenuKey = () => {
    const path = location.pathname;
    if (path === "/home") return "home";
    if (path === "/products") return "products";
    if (path === "/products/add") return "add-product";
    if (path === "/products/orders") return "orders-fulfillment";
    if (path === "/cart") return "cart";
    if (path === "/orders") return "orders";
    if (path === "/profile") return "profile";
    return "";
  };

  const menuItems = [
    // {
    //   key: "home",
    //   icon: <HomeOutlined />,
    //   label: "Home",
    //   onClick: () => navigate("/home"),
    // },
  ];

  // Add seller-specific menu items
  if (user.role === SELLER) {
    menuItems.push(
      {
        key: "products",
        icon: <ShoppingOutlined />,
        label: "My Products",
        onClick: () => navigate("/products"),
      },
      {
        key: "add-product",
        icon: <PlusCircleOutlined />,
        label: "Add Product",
        onClick: () => navigate("/products/add"),
      },
      {
        key: "orders-fulfillment",
        icon: <ShopOutlined />,
        label: "Order Fulfillment",
        onClick: () => navigate("/products/orders"),
      }
    );
  }

  // Add buyer-specific menu items
  if (user.role === BUYER) {
    menuItems.push(
      {
        key: "home",
        icon: <HomeOutlined />,
        label: "Home",
        onClick: () => navigate("/home"),
      },
      {
        key: "cart",
        icon: <ShoppingCartOutlined />,
        label: "My Cart",
        onClick: () => navigate("/cart"),
      },
      {
        key: "orders",
        icon: <FileTextOutlined />,
        label: "Orders",
        onClick: () => navigate("/orders"),
      }
    );
  }

  // Add profile menu item for all users
  // menuItems.push({
  //   key: "profile",
  //   icon: <UserOutlined />,
  //   label: "Profile",
  //   onClick: () => navigate("/profile"),
  // });

  return (
    <AntHeader
      style={{
        background: token.colorBgWhite,
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}
    >
      <Flex align="center">
        <div
          onClick={navToHome}
          style={{
            cursor: "pointer",
            marginRight: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Title
            level={4}
            style={{
              margin: 0,
              color: token.colorPrimary,
              transition: "color 0.3s",
            }}
          >
            Moly Market
          </Title>
          {user.role === SELLER && (
            <Badge
              count="Seller"
              style={{
                backgroundColor: token.colorError,
                marginLeft: 8,
              }}
            />
          )}
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[getActiveMenuKey()]}
          items={menuItems}
          style={{
            flex: 1,
            minWidth: 520,
            borderBottom: "none",
            background: token.colorBgWhite,
          }}
        />
      </Flex>

      <Space align="center">
        <Text type="secondary">Welcome, {user.username}</Text>
        <Divider type="vertical" />
        <Avatar
          onClick={() => {
            navigate("/profile");
          }}
          style={{ backgroundColor: token.colorPrimary, cursor: "pointer" }}
          icon={<UserOutlined />}
        />
      </Space>
    </AntHeader>
  );
};

export default Header;
