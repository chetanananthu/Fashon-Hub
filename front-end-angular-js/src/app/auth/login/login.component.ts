import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Auth } from '../../../models/auth.model';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Router } from '@angular/router';
import { CartService } from '../../cart/cart.service';


@Component({
  selector: 'app-login',
  standalone: true,  // Marks this component as standalone
  imports: [CommonModule, ReactiveFormsModule,NavbarComponent],  // Import CommonModule for *ngIf
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  constructor(
    private FormBuilder: FormBuilder,
    private authService:AuthService,
    private router:Router,
    private cartService:CartService
    ) {}

  ngOnInit(): void {
    this.loginForm = this.FormBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const login:Auth={
      email:this.loginForm.value.email,
      password:this.loginForm.value.password
    }
    this.authService.onLogin(login);

    this.authService.authStatus$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
          console.log("calling syncCartFromLocalStorage method");
          this.cartService.syncCartFromLocalStorage(userId);
        } else {
          console.log("No userId found after login.");
        }
        this.router.navigate(['']);
      }
    });
  }
}


// import { Component, OnInit } from '@angular/core';
// import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from '../auth.service';
// import { Auth } from '../../../models/auth.model';
// import { NavbarComponent } from '../../navbar/navbar.component';
// import { Router } from '@angular/router';
// import { CartService } from '../../cart/cart.service';


// @Component({
//   selector: 'app-login',
//   standalone: true,  // Marks this component as standalone
//   imports: [CommonModule, ReactiveFormsModule,NavbarComponent],  // Import CommonModule for *ngIf
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {
//   loginForm: FormGroup = new FormGroup({});

//   constructor(
//     private FormBuilder: FormBuilder,
//     private authService:AuthService,
//     private router:Router,
//     private cartService:CartService
//     ) {}

//   ngOnInit(): void {
//     this.loginForm = this.FormBuilder.group({
//       email: ['', [Validators.required,Validators.email]],
//       password: ['', Validators.required]
//     });
//   }

//   onSubmit() {
//     const login:Auth={
//       email:this.loginForm.value.email,
//       password:this.loginForm.value.password
//     }
//     this.authService.onLogin(login);
//     const userId=sessionStorage.getItem('userId');
//     if(userId)
//       this.cartService.syncCartFromLocalStorage(userId);
//     else
//       console.log("no userId");
//     this.router.navigate(['']);
//   }
// }

