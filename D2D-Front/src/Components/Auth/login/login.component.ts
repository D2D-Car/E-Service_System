import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const { email, password } = this.loginForm.value;
        const userData = await this.authService.signIn(email, password);
        
        // Always check email verification first
        if (!this.authService.isEmailVerified()) {
          this.router.navigate(['/auth/pending-verification']);
        } else {
          // Route based on user role only if verified
          this.routeToUserDashboard(userData.role);
        }
      } catch (error: any) {
        this.errorMessage = error;
      } finally {
        this.isLoading = false;
      }
    }
  }

  async signInWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const userData = await this.authService.signInWithGoogle();
      this.routeToUserDashboard(userData.role);
    } catch (error: any) {
      this.errorMessage = error;
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithFacebook() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const userData = await this.authService.signInWithFacebook();
      this.routeToUserDashboard(userData.role);
    } catch (error: any) {
      this.errorMessage = error;
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
    }
    return '';
  }

  private routeToUserDashboard(userType: string): void {
    switch (userType) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'driver':
        this.router.navigate(['/driver']);
        break;
      case 'technician':
        this.router.navigate(['/technician']);
        break;
      case 'user':
      default:
        this.router.navigate(['/customer']);
        break;
    }
  }
}