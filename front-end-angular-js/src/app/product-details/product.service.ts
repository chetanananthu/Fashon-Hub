import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url="http://localhost:3000/api/products";

  constructor(private http:HttpClient) { }


  getProductById(id:string ):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  } 
}
