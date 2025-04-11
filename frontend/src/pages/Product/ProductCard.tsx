import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { BUYER, SELLER } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, user, cartId }: any) => {
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  const addToCart = async () => {
    const data = {
      username: user?.username,
      productId: product.id,
      quantity,
      cartId,
    };
    try {
      await axios.post(`${import.meta.env.VITE_API_URL!}/api/cart/add`, data, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      toast.success(`Added to cart!`);
    } catch (e: any) {
      toast.error(e.response.data);
    }
  };

  const editProduct = () => {
    navigate(`/editProduct/${product.id}`);
  };

  function navigateToReviews(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    navigate(`/product/${product.id}/reviews`, {
      state: { user: user, product: product, cartId: cartId },
    });
  }
  return (
    <div className="border rounded-lg shadow-lg p-4 max-w-xs bg-white">
      <img
        className="w-[300px] h-[200px]"
        src={`data:image/png;base64,${product.images}`}
        alt={product.name}
      />
      <h2 className="text-lg font-bold text-purple-600">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-purple-600 font-semibold">
        ${product.price.toFixed(2)}
      </p>
      <p className="text-sm text-gray-500">Category: {product.category}</p>
      <div className="flex justify-between">
        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        {user.role == BUYER && (
          <div className="flex gap-2 text-gray-500 items-center">
            <span className="text-sm">Qty: </span>
            <input
              className="w-[50px] border p-1 rounded-md"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
        )}

        {user.role == SELLER && (
          <button
            onClick={editProduct}
            className="mt-4 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
          >
            Edit Product
          </button>
        )}
      </div>
      {user.role == BUYER && (
        <button
          onClick={addToCart}
          className="mt-4 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
        >
          Add to Cart
        </button>
      )}
      {user.role == BUYER && (
        <button
          onClick={navigateToReviews}
          className="mt-4 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
        >
          Reviews
        </button>
      )}
    </div>
  );
};

export default ProductCard;
