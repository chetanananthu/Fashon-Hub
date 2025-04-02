import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule,ToolbarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  role: string | null = null;
  userId:String | null= null;

  constructor(
    private authService: AuthService,
    private router:Router,
    private cartService:CartService
    ) {}

  ngOnInit() {
    this.authService.role$.subscribe((role:any) => {
      console.log(role)
      this.role = role;  // Update UI dynamically
    });

    this.authService.userId$.subscribe((userId:any)=>{
      this.userId=userId;
    })
  }

  onLogOut() {
    this.authService.onLogout();
  }

  wishlist(){
    if(this.role===null){
      this.router.navigate(["/login"]);
    }
    else{
      this.router.navigate(["/wishlist"])
    }
  }
}
