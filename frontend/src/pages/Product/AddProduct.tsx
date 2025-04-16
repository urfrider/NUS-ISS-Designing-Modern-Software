import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import {
  Button,
  Checkbox,
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
} from "antd";
import { Content } from "antd/es/layout/layout";
import { UploadOutlined } from "@ant-design/icons";
import type { CheckboxProps, UploadProps } from "antd";

export interface ProductFormData {
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
    // register,
    // handleSubmit,
    // formState: { errors },
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

  // const onImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setImageFile(event.target.files[0]);
  //   }
  // };

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
      form.resetFields();
    } catch (e) {
      console.log(e);
    }
  };

  const [form] = Form.useForm();

  const categoryOptions = [
    { label: "IT", value: "IT" },
    { label: "Fashion", value: "Fashion" },
    { label: "Beauty", value: "Beauty" },
    { label: "Home", value: "Home" },
    { label: "Health", value: "Health" },
    { label: "Others", value: "Others" },
  ];

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

  const onFinish = (values: ProductFormData) => {
    onSubmit(values);
    form.resetFields();
    setHasDiscount(false);
  };

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
            Create Product
          </Typography.Title>
          <Flex vertical>
            <Form layout="vertical" form={form} onFinish={onFinish}>
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
                    <Form.Item label="Has Discount" name="hasDiscount">
                      <Checkbox onChange={onChange}></Checkbox>
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
                        ]}
                      >
                        <InputNumber suffix="%" style={{ width: "100%" }} />
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

// <div className="h-full w-full flex flex-col justify-center items-center">
//   <h1 className=" text-xl mb-4">Create Product</h1>
//   <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
//     <div className="flex gap-2">
//       <span className="">Name</span>
//       <input {...register("name", { required: true })} />
//       {errors.name && <p className="text-red-500">Name is required.</p>}
//     </div>
//     <div className=" flex gap-2">
//       <span className="">Description</span>
//       <input {...register("description", { required: true })} />
//       {errors.description && (
//         <p className="text-red-500">Description is required.</p>
//       )}
//     </div>
//     <div className=" flex gap-2">
//       <span className="">Price</span>
//       <input
//         type="number"
//         step="any"
//         {...register("price", { required: true })}
//       />
//       {errors.price && <p className="text-red-500">Price is required.</p>}
//     </div>
//     <div className="flex gap-2 items-center">
//       <span className="">Category</span>
//       <select
//         {...register("category", { required: true })}
//         className="border p-1"
//       >
//         <option value="">Select Category</option>
//         <option value="IT">IT</option>
//         <option value="Fashion">Fashion</option>
//         <option value="Beauty">Beauty</option>
//         <option value="Home">Home</option>
//         <option value="Health">Health</option>
//         <option value="Others">Others</option>
//       </select>
//       {errors.category && (
//         <p className="text-red-500">Category is required.</p>
//       )}
//     </div>
//     <div className=" flex gap-2">
//       <span className="">Image</span>
//       <input type="file" accept="images/*" onChange={onImageUpload} />
//     </div>
//     <div className=" flex gap-2">
//       <span className="">Stock</span>
//       <input type="number" {...register("stock", { required: true })} />
//       {errors.stock && <p className="text-red-500">Stock is required.</p>}
//     </div>

//     <div className="flex gap-2 items-center">
//       <span className="">Has Discount</span>
//       <input
//         type="checkbox"
//         {...register("hasDiscount")}
//         onChange={(e) => setHasDiscount(e.target.checked)}
//       />
//     </div>

//     {hasDiscount && (
//       <div className="flex gap-2 items-center">
//         <span className="">Discount Percentage</span>
//         <input
//           type="number"
//           {...register("discountPercentage", { required: hasDiscount })}
//           min="0"
//           max="100"
//         />
//         {errors.discountPercentage && (
//           <p className="text-red-500">Enter a valid discount percentage.</p>
//         )}
//       </div>
//     )}

//     <button>Submit</button>
//   </form>
// </div>
