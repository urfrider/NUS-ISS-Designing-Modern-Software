import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product, user }: any) => {
  const [quantity, setQuantity] = useState(0);

  const addToCart = async () => {
    const data = { username: user?.username, productId: product.id, quantity };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL!}/api/cart/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log(response);
      toast.success(`Added to cart!`);
    } catch (e: any) {
      toast.error(e.response.data);
      console.log(e.response.data);
    }
  };

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
        <div className="flex gap-2 text-gray-500 items-center">
          <span className="text-sm">Qty: </span>
          <input
            className="w-[50px] border p-1 rounded-md"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
      </div>
      <button
        onClick={addToCart}
        className="mt-4 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
