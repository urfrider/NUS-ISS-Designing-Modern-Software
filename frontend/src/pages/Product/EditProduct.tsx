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
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Layout,
  Row,
  Select,
  Typography,
  Upload,
  Space,
  Card,
} from "antd";
import { Content } from "antd/es/layout/layout";
import {
  UploadOutlined,
  DollarOutlined,
  TagOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { categoryOptions, ProductFormData } from "./AddProduct";
import { useDesignToken } from "../../DesignToken";
import CustomCard from "../../components/custom/CustomCard/CustomCard";
import CustomTypography from "../../components/custom/CustomTypography/CustomTypography";
import CustomButton from "../../components/custom/CustomButton/CustomButton";
import CustomInputNumber from "../../components/custom/CustomInputNumber/CustomInputNumber";
import CustomInputComponent from "../../components/custom/CustomInput/CustomInput";
import { AddProductImagePreview } from "./ProductStyles";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const token = useDesignToken();
  const { CustomTextArea, CustomInput } = CustomInputComponent;

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

        // Set image preview from existing product image
        if (response.data.images) {
          setImagePreview(`data:image/png;base64,${response.data.images}`);
        }
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
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        hasDiscount: product.hasDiscount,
        discountPercentage: product.hasDiscount
          ? product.discountPercentage
          : undefined,
      });
      setHasDiscount(product.hasDiscount);
    }
  }, [product, form]);

  const uploadProps: UploadProps = {
    accept: "image/*",
    fileList: fileList,
    listType: "picture-card",
    maxCount: 1,
    beforeUpload: (file) => {
      setImageFile(file);

      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      return false;
    },
    onRemove: () => {
      setImageFile(null);
      setImagePreview(null);
      setFileList([]);
      return true;
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
  };

  const onSubmit = async (data: ProductFormData) => {
    // If no new image file is selected but we have an existing image, proceed without image validation
    if (!imageFile && !imagePreview) {
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

    // Only append image if a new one was selected
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

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
      toast.error("Failed to update product: " + error);
    }
  };

  const onFinish = (values: ProductFormData) => {
    onSubmit(values);
  };

  if (loading)
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography.Title level={4}>Loading...</Typography.Title>
        </Content>
      </Layout>
    );

  if (!product)
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography.Title level={4}>Product not found</Typography.Title>
        </Content>
      </Layout>
    );

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgBase }}>
      <Content
        style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <CustomCard
          bordered={false}
          style={{
            borderRadius: token.borderRadiusMed,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            minWidth: 850,
          }}
        >
          <Typography.Title
            level={3}
            style={{
              marginBottom: 24,
              color: token.colorTextBase,
              textAlign: "center",
            }}
          >
            Edit Product
          </Typography.Title>

          <Divider style={{ marginTop: 0 }} />

          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            requiredMark={false}
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input product name!",
                    },
                    {
                      max: 50,
                      message: "Product name cannot be more than 50 characters",
                    },
                  ]}
                >
                  <CustomInput
                    style={{ backgroundColor: token.colorBgWhite }}
                    placeholder="Enter product name"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input product description!",
                    },
                  ]}
                >
                  <CustomTextArea
                    placeholder="Enter product description"
                    rows={4}
                    showCount
                    maxLength={255}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Price"
                      name="price"
                      rules={[
                        {
                          required: true,
                          message: "Please input price!",
                        },
                      ]}
                    >
                      <CustomInputNumber
                        prefix={<DollarOutlined />}
                        style={{ width: "100%" }}
                        min={0}
                        step={0.01}
                        precision={2}
                        placeholder="0.00"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Stock"
                      name="stock"
                      rules={[
                        {
                          required: true,
                          message: "Please input stock!",
                        },
                      ]}
                    >
                      <CustomInputNumber
                        placeholder="Quantity"
                        style={{ width: "100%" }}
                        min={0}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Category"
                  name="category"
                  rules={[
                    {
                      required: true,
                      message: "Please select product category!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select category"
                    optionFilterProp="label"
                    size="large"
                    suffixIcon={<TagOutlined />}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={categoryOptions}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <>
                      <CustomTypography.Text>
                        Product Image <br />
                        <CustomTypography.Text type="secondary">
                          Click to replace image
                        </CustomTypography.Text>
                      </CustomTypography.Text>
                    </>
                  }
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Please upload a product image!",
                    },
                  ]}
                  style={{ marginBottom: "24px" }}
                >
                  <Upload.Dragger
                    {...uploadProps}
                    height={200}
                    style={{
                      borderRadius: token.borderRadiusSmall,
                      borderColor: token.colorBorderColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    {imagePreview ? (
                      <>
                        <AddProductImagePreview
                          src={imagePreview}
                          alt="Product preview"
                        />
                      </>
                    ) : (
                      <Space direction="vertical" size="small">
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined
                            style={{
                              color: token.colorBlue,
                              fontSize: "48px",
                            }}
                          />
                        </p>
                        <p style={{ color: token.colorTextBase }}>
                          Click or drag file to upload
                        </p>
                        <p
                          style={{
                            color: token.colorTextBaseSecondary,
                            opacity: token.opacityTextSecondary,
                          }}
                        >
                          Single image upload only
                        </p>
                      </Space>
                    )}
                  </Upload.Dragger>
                </Form.Item>

                <CustomCard
                  size="small"
                  title="Discount Settings"
                  style={{
                    borderRadius: token.borderRadiusSmall,
                  }}
                >
                  <Row gutter={16} align="top">
                    <Col span={12}>
                      <Form.Item
                        name="hasDiscount"
                        valuePropName="checked"
                        style={{
                          marginBottom: "8px",
                        }}
                      >
                        <Checkbox
                          style={{
                            marginRight: "8px",
                          }}
                          onChange={(e) => {
                            setHasDiscount(e.target.checked);
                            if (!e.target.checked) {
                              form.setFieldsValue({
                                discountPercentage: undefined,
                              });
                            }
                          }}
                        />
                        <CustomTypography.Text>
                          Enable Discount
                        </CustomTypography.Text>
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
                              message: "Required!",
                            },
                          ]}
                          style={{ marginBottom: "8px" }}
                        >
                          <CustomInputNumber
                            suffix="%"
                            style={{ width: "100%" }}
                            min={0}
                            max={100}
                            placeholder="0"
                          />
                        </Form.Item>
                      )}
                    </Col>
                  </Row>
                </CustomCard>
              </Col>
            </Row>

            <Divider />

            <Flex justify="center" gap="middle" style={{ marginTop: "24px" }}>
              <CustomButton
                onClick={() => navigate("/products")}
                size="large"
                style={{ minWidth: "120px" }}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  minWidth: "120px",
                  background: token.colorPrimary,
                }}
              >
                Update Product
              </CustomButton>
            </Flex>
          </Form>
        </CustomCard>
      </Content>
    </Layout>
  );
};

export default EditProduct;
