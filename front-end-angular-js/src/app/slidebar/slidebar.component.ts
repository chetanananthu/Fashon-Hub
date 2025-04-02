import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { SlidebarService } from './slidebar.service';
import { Categoire } from '../../models/categorie';
import { CategoryService } from '../category-form/category.service';
import { BrandService } from '../brand-form/brand.service';
import { Brand } from '../../models/brand.model';
import { Product } from '../../models/product.model';
import { ProductService } from '../product-form/product.service';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { Router } from '@angular/router';
import { WishlistService } from '../wishlist/wishlist.service';
import { CartService } from '../cart/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-slidebar',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule,FormsModule,AdminNavbarComponent,RouterModule],
  templateUrl: './slidebar.component.html',
  styleUrls: ['./slidebar.component.css']
})
export class SlidebarComponent implements OnInit {
  categories: Categoire[] = [];
  brands:Brand[]=[]
  priceRanges = ['Under $50', '$50 - $100', 'Above $100'];
  products:Product[]=[]

  updatedProducts:Product[]=[];

  categoriesExpanded = true;
  brandsExpanded = true;
  priceExpanded = true;

  selectedCategories: string[] = [];
  selectedBrands: string[] = [];
  selectedPriceRanges: string[] = [];
  
  role:string|null='';

  constructor(
    private slidebarService: SlidebarService,
    private categoryService:CategoryService,
    private brandService:BrandService,
    private productService:ProductService,
    private authService:AuthService,
    private wishlistService:WishlistService,
    private cartService:CartService
    ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
    this.loadProducts();
    this.role = this.authService.getRole() ?? '';
    
    console.log("role",this.role);
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((res: { message: string, categories: any[] }) => {
      console.log('Categories:', res.categories); // For debugging
      this.categories = res.categories.map((category) => ({
        _id: category._id, // Assuming each category has an _id field
        name: category.name,
        description: category.description
      }));
    })
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


  loadProducts(): void {
    this.productService.getProducts().subscribe((res: { message: string, products: any[] }) => {
      console.log("Products", res.products);
      this.products = res.products.map((product) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        updatedPrice:0,
        stockQuantity: product.stockQuantity,
        image: product.image,
        categoryId: product.categoryId,
        brandId: product.brandId,
      }));
      this.updatedProducts = [...this.products]; // Initialize updatedProducts with all products
    });
  }

  toggleCategories() {
    this.categoriesExpanded = !this.categoriesExpanded;
  }

  toggleBrands() {
    this.brandsExpanded = !this.brandsExpanded;
  }

  togglePrice() {
    this.priceExpanded = !this.priceExpanded;
  }

  onCategoryChange(categoryId: string, event: any) {
    this.updateSelection(this.selectedCategories, categoryId, event.target.checked);
    this.filterProducts(); // Call filter function when a category is selected
  }
  
  onBrandChange(brandId: string, event: any) {
  this.updateSelection(this.selectedBrands, brandId, event.target.checked);
  this.filterProducts();
}

onPriceChange(price: string, event: any) {
  this.updateSelection(this.selectedPriceRanges, price, event.target.checked);
  this.filterProducts();
}

updateSelection(selectionArray: string[], value: string, isChecked: boolean) {
  if (isChecked) {
    selectionArray.push(value);
  } else {
    const index = selectionArray.indexOf(value);
    if (index > -1) {
      selectionArray.splice(index, 1);
    }
  }
}

filterProducts() {
  this.updatedProducts = this.products.filter(product => {
    const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.includes(product.categoryId);
    const matchesBrand = this.selectedBrands.length === 0 || this.selectedBrands.includes(product.brandId);
    const matchesPrice = this.selectedPriceRanges.length === 0 || this.isPriceInRange(""+product.price);

    return matchesCategory && matchesBrand && matchesPrice;
  });
}

isPriceInRange(price: string): boolean {
  const numericPrice = parseFloat(price);

  if (this.selectedPriceRanges.includes('Under $50') && numericPrice < 50) {
    return true;
  }
  if (this.selectedPriceRanges.includes('$50 - $100') && numericPrice >= 50 && numericPrice <= 100) {
    return true;
  }
  if (this.selectedPriceRanges.includes('Above $100') && numericPrice > 100) {
    return true;
  }
  return false;
}

deleteProduct(productId:string){
  this.productService.deleteProduct(productId).subscribe((response)=>{
    alert("Successfully deleted the product");
    this.loadProducts();
  })
}

}
