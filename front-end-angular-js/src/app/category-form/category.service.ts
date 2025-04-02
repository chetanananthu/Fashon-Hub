import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:3000/api/categories'; // ✅ API Endpoint

  constructor(private http: HttpClient) {}

  addCategory(category: any): Observable<any> {
    console.log(category);
    return this.http.post<any>(this.apiUrl, category);
  }

  getCategories(){
    return this.http.get< {message: string; categories: any[]}>(this.apiUrl);
  }
}
