import { NgIf, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  passwordVisible: boolean = false; 

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  usernameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value.toLowerCase() !== 'emilys') {
      return { usernameInvalid: true };
    }
    return null;
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password, email } = this.loginForm.value;
      const loginObject = {
        "username": username,
        "password": password,
        "email": email,
        "expiresInMins": 30
        }
      this.authService.login(loginObject).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          localStorage.setItem('user_info', JSON.stringify(response))
          this.authService.saveToken(response.accessToken);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid credentials');
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  get emailError(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    } else if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
}
