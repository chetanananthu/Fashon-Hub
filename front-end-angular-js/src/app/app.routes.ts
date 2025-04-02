import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SlidebarComponent } from './slidebar/slidebar.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { BrandFormComponent } from './brand-form/brand-form.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { CartComponent } from './cart/cart.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { WishlistComponent } from './wishlist/wishlist.component';

export const routes: Routes = [
    {path:'',component:HeaderComponent},
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},
    {path:'slide',component:SlidebarComponent},
    {path:'category',component:CategoryFormComponent},
    {path:'brand',component:BrandFormComponent},
    {path:'products',component:ProductFormComponent},
    {path:'cart/:userId',component:CartComponent},
    {path:'product/:productId',component:ProductDetailsComponent},
    {path:'wishlist',component:WishlistComponent}
];
