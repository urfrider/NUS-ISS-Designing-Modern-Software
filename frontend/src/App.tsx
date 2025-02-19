import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { AddProduct } from "./pages/Product/AddProduct";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/product"
            element={
              <PrivateRoute>
                <Outlet />
              </PrivateRoute>
            }
          >
            <Route path="add" element={<AddProduct />} />
            {/* <Route path=":id/edit" element={<EditProduct />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
