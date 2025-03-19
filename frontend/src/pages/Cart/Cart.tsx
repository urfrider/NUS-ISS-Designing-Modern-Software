import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Shopping Cart</h1>
      <button
        onClick={() => navigate("/checkout")}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Checkout
      </button>
    </div>
  );
}

export default Cart;
