import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { AddProduct } from "./pages/Product/AddProduct";
import Layout from "./Layout";
import Profile from "./pages/Profile/Profile";
import Order from "./pages/Order/Order";
import EditProfile from "./pages/Profile/EditProfile";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route 
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/product">
              <Route path="add" element={<AddProduct />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
            <Route path="/editProfile" element={<EditProfile /> } />
            <Route path="/orders" element={<Order/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;