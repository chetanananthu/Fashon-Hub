import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart } from '../../models/cart.model';
import { CartService } from './cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../product-form/product.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule,NavbarComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  userId: string | null = "";
  carts: Cart | null = null;
  products: any[] = [];

  constructor(
    private cartService: CartService,
    private router: ActivatedRoute,
    private productService: ProductService,
    private route:Router
  ) { }

  ngOnInit(): void {
    this.userId = this.router.snapshot.paramMap.get('userId');
    if (this.userId === "null") {
      const localStorageCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localStorageCart.length > 0) {
        this.carts = { products: localStorageCart ,totalAmount:this.getTotalAmount()}; // Assign products properly
        this.getProducts();
      }    
    }
    else{
    this.getCart();
    }
  }

  getCart() {
    if (this.userId) {
      this.cartService.getCart(this.userId).subscribe((response) => {
        this.carts = response;
        console.log(this.carts);
        this.getProducts();
      });
    }
  }

  getTotalProducts(): number {
    return this.carts ? this.carts.products.length : 0;
  }

  getTotalAmount(): number {
    return this.products.reduce((total, product) => total + (product.quantity * product.price), 0);
  }

  continueShopping(){
    this.route.navigate(['/slide'])
  }

  getProducts() {
    this.products = []; // Clear previous products before fetching new ones
    this.carts?.products.forEach((cartItem) => {
      this.productService.getProductById(cartItem.productId).subscribe((response: any) => {
        let product: any = {
          _id: response._id,
          name: response.name,
          description: response.description,
          price: cartItem.price,
          stockQuantity: response.stockQuantity,
          image: response.image,
          categoryId: response.categoryId,
          brandId: response.brandId,
          quantity: cartItem.quantity
        };
        this.products.push(product);
      });
    });
  }

  updateQuantity(product: any) {
    if (this.userId!=="null" && this.userId ) {
      product.quantity = Math.max(1, product.quantity); // Ensure minimum quantity of 1

      // Update local state immediately
      const cartItem = this.carts?.products.find(p => p.productId === product._id);
      if (cartItem) {
        cartItem.quantity = product.quantity;
      }

      // Call API to update backend cart
      this.cartService.updateCart(this.userId, product._id, product.quantity, product.price).subscribe(
        (response) => {
          console.log('Cart updated:', response);
        },
        (error) => {
          console.error('Error updating cart:', error);
        }
      );
    }
    else{
      console.log("hello");
    let localStorageCart=JSON.parse(localStorage.getItem('cart' ) || '[]');
    localStorageCart = localStorageCart.map((item: any) => 
  item.productId === product._id ? { ...item, quantity: product.quantity } : item
);
localStorage.setItem('cart', JSON.stringify(localStorageCart));
console.log(JSON.stringify(localStorageCart));
  }
}

  deleteCart(_id:string){
    if(this.userId){
    this.cartService.removeFromCart(this.userId,_id).subscribe((response)=>{
      this.carts=response;
      this.getProducts();
      console.log("deleted successfully");
    });
    }
  }
  proceedToPayment(){
  }
}
