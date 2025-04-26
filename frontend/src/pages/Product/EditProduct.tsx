// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { Product } from "../../types/Product";
// import { toast } from "react-toastify";

// const EditProduct = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState<Product | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const user = useSelector((state: RootState) => state.user);

//   const config = {
//     headers: {
//       Authorization: `Bearer ${user.token}`,
//     },
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/products/${id}`,
//           config
//         );
//         console.log("here", response.data)
//         setProduct(response.data);
//         setForm(response.data);
//       } catch (error) {
//         toast.error("Error fetching product");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     if (!form) return;
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImageFile(e.target.files[0]); // Set the selected image file
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const updatedForm = new FormData();
//     updatedForm.append("name", form?.name || "");
//     updatedForm.append("description", form?.description || "");
//     updatedForm.append("category", form?.category || "");
//     updatedForm.append("stock", form?.stock?.toString() || "");
//     updatedForm.append("price", form?.price?.toString() || "");
//     updatedForm.append("username", user?.username);
//     if (imageFile) {
//       updatedForm.append("imageFile", imageFile);
//     }
//     updatedForm.append("hasDiscount", "false");
//     updatedForm.append("discountPercentage", "0");

//     try {
//       await axios.put(
//         `${import.meta.env.VITE_API_URL!}/api/products/${id}`,
//         updatedForm,
//         config
//       );
//       toast.success("Product updated successfully!");
//       navigate("/products"); // Redirect after update
//     } catch (error) {
//       toast.error("Failed to update product" + error);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!product) return <p>Product not found</p>;

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h1 className="text-xl font-bold text-purple-600 mb-4">Edit Product</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <label className="block">
//           <span className="text-gray-700">Name</span>
//           <input
//             type="text"
//             name="name"
//             value={form?.name || ""}
//             onChange={handleChange}
//             className="w-full border rounded-md p-2 mt-1"
//             required
//           />
//         </label>

//         <label className="block">
//           <span className="text-gray-700">Description</span>
//           <textarea
//             name="description"
//             value={form?.description || ""}
//             onChange={handleChange}
//             className="w-full border rounded-md p-2 mt-1"
//             required
//           />
//         </label>

//         <label className="block">
//           <span className="text-gray-700">Price</span>
//           <input
//             type="number"
//             name="price"
//             value={form?.price || ""}
//             onChange={handleChange}
//             className="w-full border rounded-md p-2 mt-1"
//             required
//           />
//         </label>

//         <label className="block">
//           <span className="text-gray-700">Category</span>
//           <input
//             type="text"
//             name="category"
//             value={form?.category || ""}
//             onChange={handleChange}
//             className="w-full border rounded-md p-2 mt-1"
//             required
//           />
//         </label>

//         <label className="block">
//           <span className="text-gray-700">Stock</span>
//           <input
//             type="number"
//             name="stock"
//             value={form?.stock || ""}
//             onChange={handleChange}
//             className="w-full border rounded-md p-2 mt-1"
//             required
//           />
//         </label>

//         {/* Image Upload */}
//         <label className="block">
//           <span className="text-gray-700">Product Image</span>
//           <input
//             type="file"
//             name="image"
//             onChange={handleImageChange}
//             className="w-full border rounded-md p-2 mt-1"
//           />
//         </label>

//         <button
//           type="submit"
//           className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition"
//         >
//           Save Changes
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProduct;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Product } from "../../types/Product";
import { toast } from "react-toastify";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Layout,
  Row,
  Select,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { UploadOutlined } from "@ant-design/icons";
import { categoryOptions, ProductFormData } from "./AddProduct";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [form] = Form.useForm();

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
        console.log("here", response);
        setProduct(response.data);
        // setForm(response.data);
      } catch (error) {
        toast.error("Error fetching product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        hasDiscount: product.hasDiscount,
        discountPercentage: product.hasDiscount
          ? product.discountPercentage
          : undefined,
      });
      setHasDiscount(product.hasDiscount);
    }
  }, [product, form]);

  const props: UploadProps = {
    action: undefined,
    beforeUpload: (file) => {
      console.log("File selected:", file);
      setImageFile(file);
      return false;
    },
    onChange({ file, fileList }) {
      if (file.status !== "uploading") {
        console.log(file, fileList);
        // setImageFile(file.originFileObj as File);
      }
    },
  };

  const onChange: CheckboxProps["onChange"] = () => {
    setHasDiscount((prev) => !prev);
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log(imageFile);
    if (!imageFile) {
      toast.error("Please upload an image!");
      return;
    }

    // need to convert to formdata for key/value pair at backend
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("stock", data.stock.toString());
    formData.append("price", data.price.toString());
    formData.append("username", user?.username);
    formData.append("imageFile", imageFile);
    formData.append("hasDiscount", hasDiscount.toString());
    if (hasDiscount) {
      formData.append("discountPercentage", data.discountPercentage.toString());
    } else {
      formData.append("discountPercentage", "0");
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL!}/api/products/${id}`,
        formData,
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

  const onFinish = (values: ProductFormData) => {
    onSubmit(values);
    form.resetFields();
  };

  const productImage = (
    <img
      src={`data:image/png;base64,${product.images}`}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#EDF0FF",
        }}
      >
        <Flex
          vertical
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            paddingLeft: 30,
            paddingRight: 30,
            width: "30%",
          }}
        >
          <Typography.Title
            level={3}
            style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}
          >
            Edit Product
          </Typography.Title>
          <Flex vertical>
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              initialValues={product}
            >
              <Flex vertical>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input product name!",
                    },
                  ]}
                >
                  <Input placeholder="Name" />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input item description!",
                    },
                  ]}
                >
                  <Input placeholder="Description" />
                </Form.Item>

                <Form.Item
                  label="Price"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: "Please input item price!",
                    },
                  ]}
                >
                  <InputNumber prefix="$" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  label="Category"
                  name="category"
                  rules={[
                    {
                      required: true,
                      message: "Please select item category!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Category"
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={categoryOptions}
                  />
                </Form.Item>

                <Form.Item
                  label="Image"
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Please input item image!",
                    },
                  ]}
                  initialValue={productImage}
                >
                  <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>

                <Form.Item
                  label="Stock"
                  name="stock"
                  rules={[
                    {
                      required: true,
                      message: "Please input stock available!",
                    },
                  ]}
                >
                  <InputNumber placeholder="Stock" style={{ width: "100%" }} />
                </Form.Item>

                <Row gutter={16} align="middle">
                  <Col span={12}>
                    <Form.Item
                      label="Has Discount"
                      name="hasDiscount"
                      valuePropName="checked"
                    >
                      <Checkbox
                        onChange={(e) => {
                          setHasDiscount(e.target.checked);
                          if (!e.target.checked) {
                            form.setFieldsValue({
                              discountPercentage: undefined,
                            });
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    {hasDiscount && (
                      <Form.Item
                        label="Discount Percentage"
                        name="discountPercentage"
                        rules={[
                          {
                            required: true,
                            message: "Please input discount percentage!",
                          },
                          {
                            type: "number",
                            min: 0,
                            max: 100,
                            message: "Discount must be between 0-100%",
                          },
                        ]}
                      >
                        <InputNumber
                          suffix="%"
                          style={{ width: "100%" }}
                          precision={2}
                        />
                      </Form.Item>
                    )}
                  </Col>
                </Row>

                <Flex justify="center">
                  <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Flex>
              </Flex>
            </Form>
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
};

export default EditProduct;
