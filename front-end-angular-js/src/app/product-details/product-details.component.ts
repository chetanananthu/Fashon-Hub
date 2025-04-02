import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from './product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart/cart.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { AuthService } from '../auth/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'app-product-details',
  imports: [NavbarComponent,CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{

    constructor(
      private productService:ProductService,
      private router:ActivatedRoute,
      private cartService:CartService,
      private wishlistService:WishlistService,
      private route:Router,
      private authService:AuthService
      ){}
      wishlist: Set<string> = new Set();
      userId:string|null='';
    productId:string |null=""
    showGoToCartButton: boolean = false;
    cartList:Cart[]=[]
  ngOnInit(): void {
    this.productId=this.router.snapshot.paramMap.get("productId");
    this.getProductById();
    this.userId=this.authService.getUserId() ?? '';
    console.log(this.productId);
      this.getWishlist();
  }
    product:Product={
      _id:"",
    name:"",
    description:"",
    price:0,
    stockQuantity:0,
    image: "",
    categoryId: "",
    brandId: ""
    }

    getWishlist(){
      if(this.userId){
      this.wishlistService.getWishlist(this.userId).subscribe((wishlistProducts:any[])=>{
        console.log("hello",wishlistProducts);
        const productIds=wishlistProducts.map(product=>product._id);
        this.wishlist=new Set(productIds);
      })
      }
    }

    getCart(){
      if(this.userId){
      this.cartService.getCart(this.userId).subscribe((response)=>{
        this.cartList=response;
      })
      }
    }

    getProductById(){
      if(this.productId){
        this.productService.getProductById(this.productId).subscribe((res)=>{
          this.product=res;
          console.log("successfull");
        })
      }
    }

    addToWishlist(productId: string) {
      if (!this.userId) {
        this.route.navigate(['/login']);
        return;
      }
    
      if (this.wishlist.has(productId)) {
        this.wishlistService.removeFromWishlist(this.userId, productId).subscribe(() => {
          this.wishlist.delete(productId);
          alert("Product removed successfully")
        });
      } else {
        this.wishlistService.addToWishlist(this.userId, productId).subscribe(() => {
          this.wishlist.add(productId);
          alert("Product added successfully")
        });
      }
    
    }
    addToCart(productId: string, quantity: number = 1, price: number) {
      // If the user is not logged in, store the cart in localStorage
      if (!this.userId) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingProduct = cart.find((item: any) => item.productId === productId);
        
        if (existingProduct) {
          existingProduct.quantity += quantity; // Update quantity if the product already exists
        } else {
          cart.push({ productId, quantity, price }); // Add new product to cart
        }
        
        localStorage.setItem('cart', JSON.stringify(cart)); // Save the updated cart to localStorage
        return;
      }
    
      // If the user is logged in, call the backend API
      this.cartService.addToCart(this.userId, productId, quantity, price).subscribe(
        (response) => {
          this.showGoToCartButton = true;
          console.log('Product added to cart:', response);
        },
        (error) => {
          console.error('Error adding product to cart:', error);
        }
      );
    }

    goToCart() {
      this.route.navigate(['/cart', this.userId]); // Navigate to the cart page
    }

    syncCartFromLocalStorage() {
      const localStorageCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localStorageCart.length > 0) {
        localStorageCart.forEach((item: any) => {
          this.cartService.addToCart(this.userId!, item.productId, item.quantity, item.price).subscribe(
            (response) => {
              console.log('Product added to cart after login:', response);
            },
            (error) => {
              console.error('Error adding product from localStorage to cart:', error);
            }
          );
        });
        
        // After syncing, clear the cart from localStorage
        localStorage.removeItem('cart');
      }
    }
}
