import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandService } from './brand.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-brand-form',
  imports: [CommonModule, FormsModule,AdminNavbarComponent], 
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.css']
})
export class BrandFormComponent {
  brand = { name: '', description: '' };

  constructor(private brandService: BrandService) {}

  addBrand() {
    this.brandService.addBrand(this.brand).subscribe({
      next: (response:any) => {
        console.log('Brand added:', response);
        alert('Brand added successfully!');
        this.brand = { name: '', description: '' }; // ✅ Reset form
      },
      error: (error:any) => {
        console.error('Error adding brand:', error);
      }
    });
  }
  // getBrands(){
  //   this.brandService.getBrands().subscribe((res:{message:string,brand: any[]}) => {
  //     console.log('Brands:', res.brand); // For debugging
  //     this.brands = res.brand.map((brand) => ({
  //       _id: brand._id, // Assuming each brand has an _id field
  //       name: brand.name,
  //       description:brand.description
  //     }));
  //   });
  // }
}
