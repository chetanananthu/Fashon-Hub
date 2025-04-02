import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Auth } from '../../../models/auth.model';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,CommonModule,NavbarComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
    signupForm:FormGroup=new FormGroup({});

    ngOnInit(): void {
      this.signupForm = this.FormBuilder.group({
        email: ['', [Validators.required,Validators.email]],
        password: ['', Validators.required]
      });
    }
    constructor(
      private FormBuilder:FormBuilder,
      private authService:AuthService
      ){}

      onSubmit() {
        const signup:Auth={
          email:this.signupForm.value.email,
          password:this.signupForm.value.password
        }
        this.authService.createUser(signup);
      }
}
