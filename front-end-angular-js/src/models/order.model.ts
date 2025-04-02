export interface Order {
    _id?: string;
    userId: string;
    products: { productId: string; quantity: number; price: number }[];
    totalAmount: number;
    status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered';
    createdAt?: Date;
  }