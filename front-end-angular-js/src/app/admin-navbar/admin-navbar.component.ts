import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-admin-navbar',
  imports: [RouterModule,FormsModule,CommonModule,ToolbarComponent],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent implements OnInit{

  constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.role=this.authService.getRole();
  }

  role:string|null=null
  onLogOut(){
    this.authService.onLogout();
  }

}
