import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:3000/api/wishlist'; // Adjust backend URL

  constructor(private http: HttpClient) {}

  addToWishlist(userId: string, productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { userId, productId });
  }

  getWishlist(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }
  
  removeFromWishlist(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/${productId}`);
  }
}
