import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import ProductCard from "../Product/ProductCard";

function HomePage() {
  const user = useSelector((state: RootState) => state.user);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState<any>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const searchProducts = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/products/search?name=${query}&category=${category}&page=${page}&size=5`,
        config
      );
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(0);
    } catch (error) {
      console.log(error);
    }
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setPage((prev) => (prev == 0 ? 0 : prev - 1));
  };

  useEffect(() => {
    searchProducts();
  }, [page]);

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen flex-col">
        <div className="bg-purple-500 mt-10 p-2 rounded-md flex flex-col gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchProducts();
            }}
            className="flex gap-2 items-center"
          >
            <input
              className="w-[300px] p-1"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              onClick={searchProducts}
              className="text-white cursor-pointer"
            >
              Search
            </button>
          </form>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="border p-1"
          >
            <option value="">Select Category</option>
            <option value="IT">IT</option>
            <option value="Fashion">Fashion</option>
            <option value="Beauty">Beauty</option>
            <option value="Home">Home</option>
            <option value="Health">Health</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="flex items-center flex-col gap-2 text-white border-white border p-4 rounded-md">
          {products.map((product: any, key: number) => (
            <div
              key={`div-${key}`}
              className="flex flex-wrap justify-center gap-4 p-8"
            >
              <ProductCard product={product} user={user} />
            </div>
          ))}
        </div>
        <div className="mb-10 flex gap-2">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className="disabled:bg-slate-400 py-1 px-2 w-[70px] bg-purple-500 text-white rounded-md"
          >
            Prev
          </button>
          <button
            onClick={nextPage}
            disabled={page === totalPages - 1}
            className="disabled:bg-slate-400 py-1 px-2 w-[70px] bg-purple-500 text-white rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
