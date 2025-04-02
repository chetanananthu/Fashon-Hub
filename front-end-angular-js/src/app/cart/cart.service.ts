import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, forkJoin, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3000/api/cart'; // Replace with your backend URL

  private cartSubject = new BehaviorSubject<any[]>([]); // Holds current cart state
  cart$ = this.cartSubject.asObservable(); // Observable to subscribe to cart updates

  constructor(private http: HttpClient, private authService: AuthService) {
    // Sync cart after login
    this.authService.authStatus$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        const userId = this.authService.getUserId();
        if (userId) {
          this.syncCartFromLocalStorage(userId).subscribe();
        }
      }
    });
  }

  // Get user's cart by userId
  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  // Add or update a product in the cart
  addToCart(userId: string, productId: string, quantity: number, price: number): Observable<any> {
    const body = { productId, quantity, price };
    console.log("Adding to cart:", body);
    return this.http.post(`${this.baseUrl}/${userId}`, body);
  }


  // Update product quantity in cart
  updateCart(userId: string, productId: string, quantity: number, price: number): Observable<any> {
    const body = { productId, quantity, price };
    return this.http.put(`${this.baseUrl}/${userId}`, body);
  }

  createCart(userId: string): Observable<any> {
    const body = { userId };
    return this.http.post(`${this.baseUrl}/create`, body).pipe(
        tap(() => console.log(`Cart created for user ${userId}`))
    );
}


  // Remove product from cart
  removeFromCart(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/${productId}`);
  }

  // Sync cart from local storage to the backend using a single cart ID per user
  // 
  syncCartFromLocalStorage(userId: string): Observable<any> {
    console.log('Syncing cart for user:', userId);

    const localStorageCart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('Cart items in localStorage:', localStorageCart);

    if (localStorageCart.length > 0) {
        return this.getCart(userId).pipe(
            catchError((error) => {
                if (error.status === 404) {
                    console.log('No existing cart found. Creating a new cart...');
                    return this.createCart(userId).pipe(
                        switchMap(() => this.getCart(userId)) // Ensure we return a new cart
                    );
                }
                return throwError(error);
            }),
            switchMap((cart) => {
                console.log(cart);

                // Ensure products is an array (avoid undefined issue)
                const products = Array.isArray(cart?.products) ? cart.products : [];
                console.log("products", products);

                const requests = localStorageCart.map((item: any) => {
                    const existingItem = products.find((cartItem: any) => 
                        cartItem.productId.toString() === item.productId
                    );
                    console.log("existingItem",existingItem);
                    if (existingItem) {
                        return this.addToCart(userId, item.productId, item.quantity, item.price);
                    } else {
                      console.log(item.productId,item.quantity,item.price);
                        return this.addToCart(userId, item.productId, item.quantity, item.price);
                    }
                });

                return forkJoin(requests).pipe(
                    tap(() => {
                        console.log('Cart sync complete. Clearing local storage.');
                        localStorage.removeItem('cart');
                    })
                );
            })
        );
    } else {
        return of('No items in local storage to sync');
    }
}

}






