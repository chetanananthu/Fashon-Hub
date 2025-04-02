import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { CategoryService } from './category.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule,AdminNavbarComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {

  category = { name: '', description: '' };

  constructor(private categoryService: CategoryService) {}

  addCategory() {
    this.categoryService.addCategory(this.category).subscribe({
      next: (response:any) => {
        console.log('Category added:', response);
        alert('Category added successfully!');
        this.category = { name: '', description: '' }; // ✅ Reset form
      },
      error: (error:any) => {
        console.error('Error adding category:', error);
      }
    });
  }
}

