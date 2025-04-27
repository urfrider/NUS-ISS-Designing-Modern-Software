import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import NotificationPanel from "./components/NotificationPanel";

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <NotificationPanel />
    </>
  );
};

export default Layout;
