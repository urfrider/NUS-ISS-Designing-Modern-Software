import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  stock: number;
  price: number;
  hasDiscount: boolean;
  discountPercentage: number;
}

export const AddProduct = () => {
  const user = useSelector((state: RootState) => state.user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hasDiscount, setHasDiscount] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      stock: 0,
      price: 0,
      hasDiscount: false,
      discountPercentage: 0,
    },
  });

  const onImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFile(event.target.files[0]);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log (imageFile)
    if (!imageFile) {
      toast.error("Please upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("stock", data.stock.toString());
    formData.append("price", data.price.toString());
    formData.append("username", user?.username);
    formData.append("imageFile", imageFile);
    formData.append("hasDiscount", data.hasDiscount.toString());
    formData.append("discountPercentage", data.discountPercentage.toString());

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL!}/api/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success("Product successfully added!");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h1 className=" text-xl mb-4">Create Product</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2">
          <span className="">Name</span>
          <input {...register("name", { required: true })} />
          {errors.name && <p className="text-red-500">Name is required.</p>}
        </div>
        <div className=" flex gap-2">
          <span className="">Description</span>
          <input {...register("description", { required: true })} />
          {errors.description && (
            <p className="text-red-500">Description is required.</p>
          )}
        </div>
        <div className=" flex gap-2">
          <span className="">Price</span>
          <input
            type="number"
            step="any"
            {...register("price", { required: true })}
          />
          {errors.price && <p className="text-red-500">Price is required.</p>}
        </div>
        <div className="flex gap-2 items-center">
          <span className="">Category</span>
          <select
            {...register("category", { required: true })}
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
          {errors.category && (
            <p className="text-red-500">Category is required.</p>
          )}
        </div>
        <div className=" flex gap-2">
          <span className="">Image</span>
          <input type="file" accept="images/*" onChange={onImageUpload} />
        </div>
        <div className=" flex gap-2">
          <span className="">Stock</span>
          <input type="number" {...register("stock", { required: true })} />
          {errors.stock && <p className="text-red-500">Stock is required.</p>}
        </div>

        <div className="flex gap-2 items-center">
          <span className="">Has Discount</span>
          <input
            type="checkbox"
            {...register("hasDiscount")}
            onChange={(e) => setHasDiscount(e.target.checked)}
          />
        </div>

        {hasDiscount && (
          <div className="flex gap-2 items-center">
            <span className="">Discount Percentage</span>
            <input
              type="number"
              {...register("discountPercentage", { required: hasDiscount })}
              min="0"
              max="100"
            />
            {errors.discountPercentage && (
              <p className="text-red-500">Enter a valid discount percentage.</p>
            )}
          </div>
        )}
        
        <button>Submit</button>
      </form>
    </div>
  );
};
