export type ProductSize = "S" | "M" | "L" | "XL" | "XXL";

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAt?: number;
  category: "tees" | "hoodies" | "shorts" | "accessories";
  sizes: ProductSize[];
  colors: ProductColor[];
  images: string[];
  tags: string[];
  featured?: boolean;
  specs: {
    material: string;
    weight: string;
    fit: string;
    printing: string;
  };
};

export type CartItem = {
  product: Product;
  size: ProductSize;
  color: string;
  quantity: number;
};

export type Review = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  location: string;
};
