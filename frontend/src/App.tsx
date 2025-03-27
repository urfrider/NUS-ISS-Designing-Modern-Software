import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { ToastContainer } from "react-toastify";
import { AddProduct } from "./pages/Product/AddProduct";
import Profile from "./pages/Profile/Profile";
import Order from "./pages/Order/Order";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import EditProfile from "./pages/Profile/EditProfile";
import Layout from "./Layout";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/products/add" element={<AddProduct />} />
          </Route>

          {/* Catch-all for unauthorized access */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
