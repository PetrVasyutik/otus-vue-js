export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface ProductRating {
  rate: number;
  count: number;
}

export interface GetProductsResponse {
  products: Product[];
}

export interface GetProductResponse {
  product: Product;
}
