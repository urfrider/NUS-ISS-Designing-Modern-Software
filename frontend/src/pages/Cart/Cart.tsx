import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import axios from "axios";

function Cart() {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>([]);

  const fetchCart = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL!}/api/cart/${user?.id}`,
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    setCart(response.data);
  };

  const onClearCart = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL!}/api/cart/empty/${cart?.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setCart(response.data);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const onUndo = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL!}/api/cart/undo/${cart?.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setCart(response.data);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  console.log(cart);
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Shopping Cart</h1>
      {cart?.items?.map((item: any, idx: number) => {
        return (
          <div key={`cart-${idx}`} className="my-5">
            <div>Name: {item.name}</div>
            <div>Price: ${item.price * item.quantity}</div>
            <div></div>
          </div>
        );
      })}
      <span>Total Price: ${cart.totalAmount}</span>
      <button
        onClick={() => navigate("/checkout")}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Checkout
      </button>
      <button
        onClick={onClearCart}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Clear
      </button>
      <button
        onClick={onUndo}
        className="mt-4 p-2 bg-orange-500 text-white rounded"
      >
        Undo
      </button>
    </div>
  );
}

export default Cart;
