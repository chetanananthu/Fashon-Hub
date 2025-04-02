import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { FormsModule } from '@angular/forms';
import { Brand } from '../../models/brand.model';
import { Categoire } from '../../models/categorie';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../category-form/category.service';
import { BrandService } from '../brand-form/brand.service';
import { Product } from '../../models/product.model';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule,CommonModule,AdminNavbarComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})

export class ProductFormComponent implements OnInit {
  product = {
    name: '',
    description: '',
    price: '',
    updatedPrice:'',
    stockQuantity: '',
    image: '',
    categoryId: '', // Initially empty
    brandId: '' // Initially empty
  };

  categories: Categoire[] = [];
  brands: Brand[] = [];
  products:Product[]=[]

  constructor(
    private productService: ProductService,
    private categoryService:CategoryService,
    private brandService:BrandService
    ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();

  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((res: { message: string, categories: any[] }) => {
      console.log('Categories:', res.categories); // For debugging
      this.categories = res.categories.map((category) => ({
        _id: category._id, // Assuming each category has an _id field
        name: category.name,
        description: category.description
      }));
    });
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe((res:{message:string,brand: any[]}) => {
      console.log('Brands:', res.brand); // For debugging
      this.brands = res.brand.map((brand) => ({
        _id: brand._id, // Assuming each brand has an _id field
        name: brand.name,
        description:brand.description
      }));
    });
  }

  getProducts(){
    this.productService.getProducts().subscribe((res:{message:string,products:any[]})=>{
      this.products=res.products.map((product)=>({
        _id:product._id,
        name:product.name,
        description:product.description,
        price:product.price,
        updatedPrice:0,
        stockQuantity:product.stockQuantity,
        image: product.image,
        categoryId: product.categoryId, 
        brandId: product.brandId,
      }))
    })
  }

  onSubmit(): void {
    this.productService.addProducts(this.product).subscribe((res:any)=>{
      console.log(res.message);
    })
    this.product={
      name: '',
      description: '',
      price: '',
      updatedPrice:'',
      stockQuantity: '',
      image: '',
      categoryId: '', // Initially empty
      brandId: '' // Initially empty
    }
  }
}
