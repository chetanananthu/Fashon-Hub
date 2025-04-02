import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../auth/auth.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,NavbarComponent,AdminNavbarComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
 
  role: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.role$.subscribe((role:any) => {
      console.log(role)
      this.role = role;  // Update UI dynamically
    });
    this.autoSlide();
  }

  slides = [
    { image: 'https://i.ytimg.com/vi/eB44qyLXCNo/maxresdefault.jpg', caption: 'MEN' },
    { image: 'https://assets.vogue.com/photos/66f426815d79427b6456f2a4/master/w_2560%2Cc_limit/Holding%2520(6).jpg', caption: 'WOMEN' },
    { image: 'https://media.timeout.com/images/103945757/750/562/image.jpg', caption: 'KIDS' }
  ];
  currentIndex = 0;



  changeSlide(n: number) {
    this.currentIndex = (this.currentIndex + n + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentIndex = index;
  }

  autoSlide() {
    setInterval(() => {
      this.changeSlide(1);
    }, 2000);
  }
}
