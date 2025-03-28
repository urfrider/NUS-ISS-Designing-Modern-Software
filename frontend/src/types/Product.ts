export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string;
    hasDiscount: boolean;
    discountPercentage: number;
  }