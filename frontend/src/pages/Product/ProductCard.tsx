import React from "react";

const ProductCard = ({ product } : {product : any}) => {
  return (
    <div className="border rounded-lg shadow-lg p-4 max-w-xs bg-white">
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-purple-600 font-semibold">${product.price.toFixed(2)}</p>
      <p className="text-sm text-gray-500">Category: {product.category}</p>
      <button className="mt-4 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
