import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userDetails = {
    image: null,
    firstName: null,
    lastName: null,
    email: null,
    gender: null
  };

  constructor(private authService: AuthService, private router: Router) {
    const userInfo = localStorage.getItem('user_info');
    this.userDetails = userInfo ? JSON.parse(userInfo) : null; 
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login'])
  }
}
