import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import {
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Layout,
  Row,
  Select,
  Typography,
  Upload,
  Space,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { DollarOutlined, TagOutlined, InboxOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { useDesignToken } from "../../DesignToken";
import CustomCard from "../../components/custom/CustomCard/CustomCard";
import CustomTypography from "../../components/custom/CustomTypography/CustomTypography";
import CustomButton from "../../components/custom/CustomButton/CustomButton";
import CustomInputNumber from "../../components/custom/CustomInputNumber/CustomInputNumber";
import CustomInputComponent from "../../components/custom/CustomInput/CustomInput";
import { AddProductImagePreview } from "./ProductStyles";

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  stock: number;
  price: number;
  hasDiscount: boolean;
  discountPercentage: number;
}

export const categoryOptions = [
  { label: "IT", value: "IT" },
  { label: "Fashion", value: "Fashion" },
  { label: "Beauty", value: "Beauty" },
  { label: "Home", value: "Home" },
  { label: "Health", value: "Health" },
  { label: "Others", value: "Others" },
];

export const AddProduct = () => {
  const user = useSelector((state: RootState) => state.user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const token = useDesignToken();
  const { CustomTextArea, CustomInput } = CustomInputComponent;
  const onSubmit = async (data: ProductFormData) => {
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
      setImagePreview(null);
      setFileList([]);
      setImageFile(null);
    } catch (e) {
      console.log(e);
      toast.error("Failed to add product. Please try again.");
    }
  };

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

  const onFinish = (values: ProductFormData) => {
    onSubmit(values);
  };

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
            Create New Product
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
                  label="Product Image"
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
                      // background: token.colorBgWhite,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    {imagePreview ? (
                      <AddProductImagePreview
                        src={imagePreview}
                        alt="Product preview"
                      />
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
                    // background: "rgba(132, 144, 255, 0.05)",
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
                onClick={() => form.resetFields()}
                size="large"
                style={{ minWidth: "120px" }}
              >
                Reset
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
                Create Product
              </CustomButton>
            </Flex>
          </Form>
        </CustomCard>
      </Content>
    </Layout>
  );
};
