import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Product } from "../../types/Product";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const user = useSelector((state: RootState) => state.user);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`,
          config
        );
        setProduct(response.data);
        setForm(response.data);
      } catch (error) {
        toast.error("Error fetching product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]); // Set the selected image file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedForm = new FormData();
    updatedForm.append("name", form?.name || "");
    updatedForm.append("description", form?.description || "");
    updatedForm.append("category", form?.category || "");
    updatedForm.append("stock", form?.stock?.toString() || "");
    updatedForm.append("price", form?.price?.toString() || "");
    updatedForm.append("username", user?.username);
    if (imageFile) {
      updatedForm.append("imageFile", imageFile);
    }
    updatedForm.append("hasDiscount", "false");
    updatedForm.append("discountPercentage", "0");

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL!}/api/products/${id}`,
        updatedForm,
        config
      );
      toast.success("Product updated successfully!");
      navigate("/products"); // Redirect after update
    } catch (error) {
      toast.error("Failed to update product" + error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-bold text-purple-600 mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            name="name"
            value={form?.name || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Description</span>
          <textarea
            name="description"
            value={form?.description || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Price</span>
          <input
            type="number"
            name="price"
            value={form?.price || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Category</span>
          <input
            type="text"
            name="category"
            value={form?.category || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Stock</span>
          <input
            type="number"
            name="stock"
            value={form?.stock || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            required
          />
        </label>

        {/* Image Upload */}
        <label className="block">
          <span className="text-gray-700">Product Image</span>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full border rounded-md p-2 mt-1"
          />
        </label>

        <button
          type="submit"
          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;