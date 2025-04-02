export interface Cart{
    products: {
        productId: string;
        quantity: number;
        price: number;
      }[];
      totalAmount: number;
}