import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { BUYER, SELLER } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import { Button, Card, Flex, InputNumber, Modal, Typography } from "antd";

const ProductCard = ({ product, user, cartId }: any) => {
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const addToCart = async () => {
    const data = {
      username: user?.username,
      productId: product.id,
      quantity,
      cartId,
    };
    try {
      await axios.post(`${import.meta.env.VITE_API_URL!}/api/cart/add`, data, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      toast.success(`Added to cart!`);
    } catch (e: any) {
      toast.error(e.response.data);
    }
    setIsModalOpen(false);
  };

  const editProduct = () => {
    navigate(`/editProduct/${product.id}`);
  };

  function navigateToReviews(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    navigate(`/product/${product.id}/reviews`, {
      state: { user: user, product: product, cartId: cartId },
    });
  }
  return (
    <Flex style={{justifyContent: "space-around"}}>
      <Card
        title={
          <img
            className="w-[300px] h-[200px]"
            src={`data:image/png;base64,${product.images}`}
            alt={product.name}
          />
        }
        style={{
          width: 300,
          boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
        }}
      >
        <Typography.Title level={5} style={{ color: "#0055BD" }}>
          {product.name}
        </Typography.Title>
        <Typography style={{ paddingBottom: 5, opacity: 0.6 }}>
          {product.description}
        </Typography>
        <Typography style={{ paddingBottom: 5, color: "#0055BD" }}>
          ${product.price.toFixed(2)}
        </Typography>
        {/* <Typography>{product.category}</Typography> */}
        {/* <Typography>{product.stock}</Typography> */}

        {user.role == BUYER && (
          <Flex style={{ gap: 10 }}>
            <Button
              type="primary"
              style={{ marginTop: 10, width: "100%" }}
              onClick={showModal}
            >
              Add to Cart
            </Button>
            <Button
              onClick={navigateToReviews}
              style={{ marginTop: 10, width: "100%" }}
            >
              Reviews
            </Button>
            <Modal
              title={`Item: ${product.name}`}
              open={isModalOpen}
              onOk={addToCart}
              okText="Add"
              onCancel={() => {
                setIsModalOpen(false);
                setQuantity(0);
              }}
              style={{ maxWidth: "400px" }}
            >
              <Typography style={{ paddingBottom: 10, paddingTop: 10 }}>
                Quantity
              </Typography>
              <InputNumber
                value={quantity}
                onChange={(value) => setQuantity(value || 0)}
                min={1}
                style={{ width: "100%", marginBottom: 5 }}
              />
            </Modal>
          </Flex>
        )}

        {user.role === SELLER && (
          <Button
            type="primary"
            style={{ marginTop: 10, width: "100%" }}
            onClick={editProduct}
            disabled={product.username!==user.username}
          >
            Edit Product
          </Button>
        )}
      </Card>
    </Flex>
  );
};

export default ProductCard;

// <div className="border rounded-lg shadow-lg p-4 max-w-xs bg-white">
//   <img
//     className="w-[300px] h-[200px]"
//     src={`data:image/png;base64,${product.images}`}
//     alt={product.name}
//   />
//   <h2 className="text-lg font-bold text-purple-600">{product.name}</h2>
//   <p className="text-gray-600">{product.description}</p>
//   <p className="text-purple-600 font-semibold">
//     ${product.price.toFixed(2)}
//   </p>
//   <p className="text-sm text-gray-500">Category: {product.category}</p>
//   <div className="flex justify-between">
//     <p className="text-sm text-gray-500">Stock: {product.stock}</p>

//     {user.role == SELLER && (
//       <button
//         onClick={editProduct}
//         className="mt-4 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
//       >
//         Edit Product
//       </button>
//     )}
//   </div>
//   {user.role == BUYER && (
//     <Flex>
//       <Button
//         type="primary"
//         style={{ marginTop: 10, width: "100%" }}
//         onClick={showModal}
//       >
//         Add to Cart
//       </Button>
//       <Modal
//         title={`Item: ${product.name}`}
//         open={isModalOpen}
//         onOk={addToCart}
//         okText="Add"
//         onCancel={() => {
//           setIsModalOpen(false);
//           setQuantity(0);
//         }}
//         style={{ maxWidth: "400px" }}
//       >
//         <Typography style={{ paddingBottom: 10, paddingTop: 10 }}>
//           Quantity
//         </Typography>
//         <InputNumber
//           value={quantity}
//           onChange={(value) => setQuantity(value || 0)}
//           min={1}
//           style={{ width: "100%", marginBottom: 5 }}
//         />
//       </Modal>
//     </Flex>
//   )}
// </div>
