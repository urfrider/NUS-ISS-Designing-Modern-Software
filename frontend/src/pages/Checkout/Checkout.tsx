import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [creditCardExpiry, setCreditCardExpiry] = useState("");
  const [creditCardCVC, setCreditCardCVC] = useState("");
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    toast("Order Placed");
    navigate("/cart");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-16">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="flex flex-col text-left gap-4">
        <h2 className="text-lg font-semibold">Items</h2>
        <div className="flex flex-row justify-between w-96">
          Tesla Model S<div>x1</div>
        </div>

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
            <div>$100</div>
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
              checked={paymentMethod === "credit"}
              onChange={() => setPaymentMethod("credit")}
            />
            Credit Card
          </label>

          {paymentMethod === "credit" && (
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
