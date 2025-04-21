import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";

function Checkout() {
  const user = useSelector((state: RootState) => state.user);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [creditCardHolder, setcreditCardHolder] = useState("");
  const [creditCardExpiry, setCreditCardExpiry] = useState("");
  const [creditCardCVC, setCreditCardCVC] = useState("");
  const [cart, setCart] = useState<any>([]);
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const fetchCart = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL!}/api/cart/${user?.id}`,
      config
    );
    setCart(response.data);
  };

  const handlePlaceOrder = async () => {
    var data: any = {
      username: user?.username,
      cartId: cart?.id,
    };

    if (paymentMethod == "creditCard") {
      data["cardNumber"] = creditCardNumber;
      data["cardHolder"] = creditCardHolder;
      data["cardExpiry"] = creditCardExpiry;
      data["cardCvc"] = creditCardCVC;
    } else if (paymentMethod == "paypal") {
      data["paypalEmail"] = paypalEmail;
    }

    await makePayment(data);
    await sendNotification();
    // navigate("/cart");
  };
  
  useEffect(() => {
    fetchCart();
  }, []);

  async function makePayment(data: any) {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL!}/api/payment`,
        {
          paymentType: paymentMethod,
          amount: cart?.totalAmount,
          details: data,
        },
        config
      );
      toast.success(`Payment successful with ${paymentMethod}`);
    } catch (e) {
      console.log(e);
    }
  }

  async function sendNotification() {
      for (const item of cart.items) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL!}/notif/createNotification`,
            {
              senderId: user.id,
              message: `An order for '${item.name}' has been placed!`,
              type: "ORDER_CREATED",
              createdAt: new Date().toISOString(),
              isRead: false,
              reciepientId: item.sellerId,
            },
            config
          );
          toast.success(`Order successful`);
        } catch (e) {
          console.log(e);
        }
      }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-16">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="flex flex-col text-left gap-4">
        <h2 className="text-lg font-semibold">Items</h2>
        {cart?.items?.map((item: any, idx: number) => (
          <div
            key={`checkout-${idx}`}
            className="flex flex-row justify-between w-96"
          >
            {item?.name}
            <div>x{item?.quantity}</div>
          </div>
        ))}

        <div className="flex flex-col gap-2 ">
          <h2 className="text-lg font-semibold">Select Payment Method</h2>
          <div className="flex flex-row justify-between w-96">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              Cash Balance
            </label>
            <div>${user.balance}</div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
            />
            PayPal
          </label>

          {paymentMethod === "paypal" && (
            <input
              type="email"
              placeholder="Enter PayPal Email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              className="border p-2 rounded w-full"
            />
          )}

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="credit"
              checked={paymentMethod === "creditCard"}
              onChange={() => setPaymentMethod("creditCard")}
            />
            Credit Card
          </label>

          {paymentMethod === "creditCard" && (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Card Number"
                value={creditCardNumber}
                onChange={(e) => setCreditCardNumber(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Card Holder Name"
                value={creditCardHolder}
                onChange={(e) => setcreditCardHolder(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Expiry Date (MM/YY)"
                value={creditCardExpiry}
                onChange={(e) => setCreditCardExpiry(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="CVC"
                value={creditCardCVC}
                onChange={(e) => setCreditCardCVC(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
