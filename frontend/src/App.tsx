import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { AddProduct } from "./pages/Product/AddProduct";
import Layout from "./Layout";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/editProfile";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

function App() {
  const user = useSelector((state: RootState) => state.user);

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
            <Route path="/editProfile" element={<EditProfile user={user} /> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;