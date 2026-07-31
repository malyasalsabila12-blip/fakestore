export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  items: Product[];
  status: 'completed' | 'pending' | 'processing' | 'cancelled';
  paymentMethod: string;
}
