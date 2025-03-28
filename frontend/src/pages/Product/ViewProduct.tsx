import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export const ViewProduct = () => {
  const user = useSelector((state: RootState) => state.user);
  const [products, setProducts] = useState<any>([]);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/seller/${user.id}`,
        config
      );
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-8 max-w-6xl w-full">
        {products.map((product: any, key: number) => (
          <ProductCard key={key} product={product} user={user} />
        ))}
      </div>
    </div>
  );
};
