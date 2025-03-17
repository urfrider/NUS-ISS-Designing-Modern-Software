import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center flex-col gap-2 text-white border-white border p-4 rounded-md">
          <h1 className="">Home Page</h1>
          <div className="my-4">
            <button
              onClick={() => navigate("/product/add")}
              className="border border-purple-300 rounded-xl p-2 hover:bg-purple-300 duration-300"
            >
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
