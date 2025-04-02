import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products'; // Adjust based on your backend

  constructor(private http: HttpClient) {}

  addProducts(product:any){
    return this.http.post(this.apiUrl,product);
  }
  getProducts(){
    return this.http.get<{message:string,products:any[]}>(this.apiUrl);
  }

  getProductById(id:string){
    return this.http.get<{product:Product}>(`${this.apiUrl}/${id}`);
  }

  deleteProduct(id:string){
    return this.http.delete<{product:Product}>(`${this.apiUrl}/${id}`);
  }
}

