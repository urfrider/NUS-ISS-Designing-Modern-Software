import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ProductReviews = () => {
  const location = useLocation();
  const { user, product } = location.state || {};
  const [reviews, setReviews] = useState([]);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  async function addReview(rating: number, content: string) {
    console.log("Add Review");
    const review = {
      buyer: user.id,
      product: product.id,
      rating: rating,
      content: content,
    };
    console.log(review);
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/reviews/write`,
      review,
      config
    );
    toast.success("Review written successfully!");
    fetchReviews();
  }

  async function fetchReviews() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews/product/${product.id}`,
        config
      );
      console.log(response);
      const data = response.data.reverse();
      setReviews(data);
    } catch (error) {
      toast.error("Failed to fetch reviews.");
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reviews for {product?.name}</h1>
      <div className="flex gap-12">
        {/* Left Section: Product Details */}
        <div className="w-1/2">
          <p className="text-gray-600">Product ID: {product?.id}</p>
          <div className="flex justify-center items-center">
            <img
              className="h-100 p-4"
              src={`data:image/png;base64,${product.images}`}
              alt={product.name}
            />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const rating = Number(formData.get("rating"));
              const content = formData.get("content") as string;
              addReview(rating, content);
            }}
            className="mt-4"
          >
            <div className="mb-4">
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                Rating
              </label>
              <select
                id="rating"
                name="rating"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled selected>
                  Select a rating
                </option>
                <option value="1">Poor</option>
                <option value="2">Fair</option>
                <option value="3">Good</option>
                <option value="4">Very Good</option>
                <option value="5">Excellent</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Review Content
              </label>
              <textarea
                id="content"
                name="content"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Review
            </button>
          </form>
        </div>

        {/* Right Section: Reviews */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold">Reviews</h2>
          {reviews.length > 0 ? (
            <ul className="mt-2 space-y-4">
              {reviews.map((review: any) => (
                <li
                  key={review.id}
                  className="p-4 border rounded shadow-sm bg-gray-50"
                >
                  <p className="text-sm text-gray-600">
                    <strong>Rating:</strong> {review.rating}/5
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Content:</strong> {review.content}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
