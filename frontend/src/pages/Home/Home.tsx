import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import ProductCard from "../Product/ProductCard";

function HomePage() {
  const user = useSelector((state: RootState) => state.user);

  const [products, setProducts] = useState<any>([]);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`,
          config
        );
        setProducts(response.data);
      } catch (error) {}
    };

    fetchSellerProfile();
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center flex-col gap-2 text-white border-white border p-4 rounded-md">
          <div className="flex flex-wrap justify-center gap-4 p-8">
            {products.map((product: any) => (
              <ProductCard product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
