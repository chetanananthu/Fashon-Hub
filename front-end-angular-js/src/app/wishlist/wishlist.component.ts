import { Component, OnInit } from '@angular/core';
import { WishlistService } from './wishlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit{

  products:any[]=[];
  userId:string | null=null;
  constructor(private wishlistService:WishlistService){}
  ngOnInit(): void {
    this.userId=sessionStorage.getItem('userId');
    this.getWishlist();
  }

  getWishlist(){
    if(this.userId)
      this.wishlistService.getWishlist(this.userId).subscribe((wishlistProducts:any[])=>{
        this.products=wishlistProducts;
      })
  }
}
