import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import ProductCard from "../Product/ProductCard";
import { Button, Col, Flex, Form, Input, Layout, Row, Select } from "antd";
import { Content } from "antd/es/layout/layout";

export interface SearchType {
  query: string;
  category: string | undefined;
}

export interface ProductType {
  category: string;
  description: string;
  discountPercentage: number;
  hasDiscount: boolean;
  id: number;
  images: string;
  name: string;
  price: number;
  stock: number;
  username: string;
}

function HomePage() {
  const user = useSelector((state: RootState) => state.user);
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [cart, setCart] = useState<any>([]);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const fetchCart = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL!}/api/cart/${user?.id}`,
      config
    );
    setCart(response.data);
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

  const [form] = Form.useForm();

  useEffect(() => {
    searchProducts();
    fetchCart();
  }, [page, query, category]);

  const categoryOptions = [
    { label: "IT", value: "IT" },
    { label: "Fashion", value: "Fashion" },
    { label: "Beauty", value: "Beauty" },
    { label: "Home", value: "Home" },
    { label: "Health", value: "Health" },
    { label: "Others", value: "Others" },
  ];

  const onFinish = (values: SearchType) => {
    setQuery(values.query);
    setCategory(values.category || "");
  };

  const SearchBar = () => {
    return (
      <Form
        form={form}
        onFinish={onFinish}
        layout="inline"
        style={{
          paddingBottom: "40px",
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Form.Item label="Query" name="query">
          <Input placeholder="Search" />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select
            showSearch
            style={{ width: 200 }}
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

        <Form.Item>
          <Button type="link" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
    );
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
          align="center"
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: 40,
          }}
        >
          <SearchBar />
          <Row gutter={[16, 16]} justify="start" style={{ width: "100%" }}>
            {products.map((product: any, key: number) => (
              <Col key={key} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} user={user} cartId={cart?.id} />
              </Col>
            ))}
          </Row>
          <Flex style={{ paddingTop: 30, gap: 10 }}>
            <Button onClick={prevPage} disabled={page === 0}>
              Previous Page
            </Button>
            <Button onClick={nextPage} disabled={page === totalPages - 1}>
              Next Page
            </Button>
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
}

export default HomePage;

//   return (
//     <div>
//       <div className="flex justify-center items-center min-h-screen flex-col">
//         <div className="bg-purple-500 mt-10 p-2 rounded-md flex flex-col gap-2">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               searchProducts();
//             }}
//             className="flex gap-2 items-center"
//           >
//             <input
//               className="w-[300px] p-1"
//               onChange={(e) => setQuery(e.target.value)}
//             />
//             <button
//               type="submit"
//               onClick={searchProducts}
//               className="text-white cursor-pointer"
//             >
//               Search
//             </button>
//           </form>
//           <select
//             onChange={(e) => setCategory(e.target.value)}
//             className="border p-1"
//           >
//             <option value="">Select Category</option>
//             <option value="IT">IT</option>
//             <option value="Fashion">Fashion</option>
//             <option value="Beauty">Beauty</option>
//             <option value="Home">Home</option>
//             <option value="Health">Health</option>
//             <option value="Others">Others</option>
//           </select>
//         </div>
//         <div className="flex items-center flex-col gap-2 text-white border-white border p-4 rounded-md">
//           {products.map((product: any, key: number) => (
//             <div
//               key={`div-${key}`}
//               className="flex flex-wrap justify-center gap-4 p-8"
//             >
//               <ProductCard product={product} user={user} cartId={cart?.id} />
//             </div>
//           ))}
//         </div>
//         <div className="mb-10 flex gap-2">
//           <button
//             onClick={prevPage}
//             disabled={page === 0}
//             className="disabled:bg-slate-400 py-1 px-2 w-[70px] bg-purple-500 text-white rounded-md"
//           >
//             Prev
//           </button>
//           <button
//             onClick={nextPage}
//             disabled={page === totalPages - 1}
//             className="disabled:bg-slate-400 py-1 px-2 w-[70px] bg-purple-500 text-white rounded-md"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
