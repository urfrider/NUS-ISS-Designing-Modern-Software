import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function Order() {
  const user = useSelector((state: RootState) => state.user);
  const [orders, setOrders] = useState<any>([]);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/buyer/${user.id}`,
          config
        );
        setOrders(response.data);
      } catch (error) {}
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div>Past Orders</div>
      {/* Header Row */}
      <div className="flex flex-row w-60 justify-between font-bold">
        <div>Order ID</div>
        <div>Total Amount</div>
      </div>
      {orders.map((order: any, key: any) => (
        <div className="flex flex-col">
          <div className="flex flex-row  w-56 justify-between">
            <div key={key}>{order.id}</div>
            <div key={key}>{order.totalAmount}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Order;
