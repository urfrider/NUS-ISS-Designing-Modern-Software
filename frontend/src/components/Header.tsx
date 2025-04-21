import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { BUYER, SELLER } from "../constants/constants";

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const navToHome = () => {
    navigate("/home");
  };
  return (
    <header className="bg-white text-black px-20 py-4 shadow-md flex justify-between items-center">
      <div className="flex">
        <h1
          className="text-xl font-bold hover:text-purple-900 duration-300 cursor-pointer "
          onClick={navToHome}
        >
          Moly Market
        </h1>
        {user.role === SELLER && (
          <h1 className="text-red-500 font-semibold italic ml-2">Seller</h1>
        )}
      </div>
      <nav>
        <ul className="flex space-x-12">
          <li>
            <Link to="/home" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          {user.role === SELLER && (
            <>
              <li>
                <Link to="/products" className="hover:text-blue-600">
                  My Products
                </Link>
              </li>
              <li>
                <Link to="/products/add" className="hover:text-blue-600">
                  Add Product
                </Link>
              </li>
              <li>
                <Link to="/products/orders" className="hover:text-blue-600">
                  Order Fulfilment
                </Link>
              </li>
            </>
          )}
          {user.role === BUYER && (
            <li>
              <Link to="/cart" className="hover:text-blue-600">
                My Cart
              </Link>
            </li>
          )}
          {user.role === BUYER && (
            <li>
              <Link to="/orders" className="hover:text-blue-600">
                Orders
              </Link>
            </li>
          )}

          {/* <li><Link to="/subscribe" className="hover:text-blue-600">Subscribe</Link></li> */}
          <li>
            <Link to="/profile" className="hover:text-blue-600">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
