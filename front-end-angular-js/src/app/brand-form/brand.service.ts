import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class BrandService {
  private apiUrl = 'http://localhost:3000/api/brands'; 

  constructor(private http: HttpClient) {}

  addBrand(brand: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, brand);
  }

  getBrands(){
    return this.http.get<{message:string,brand: any[]}>(this.apiUrl);
  }
}
