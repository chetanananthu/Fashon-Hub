export interface Product{
    _id:string;
    name:string;
    description:string;
    price:number;
    stockQuantity:number;
    image: string;
    categoryId: string; // Initially empty
    brandId: string;
}