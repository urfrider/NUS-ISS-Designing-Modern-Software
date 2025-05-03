export interface CartItemType {
  name: string;
  description: string;
  price: number;
  catagory: string;
  images: string;
  sellerId: number;
  quantity: number;
  hasDiscount: boolean;
  discountPercentage: number;
}

export interface CartType {
  id: number;
  buyerId: number;
  totalAmount: number;
  items: CartItemType[];
}
