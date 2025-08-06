import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  async onSubmit() {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const { displayName, email, password } = this.signUpForm.value;
        await this.authService.signUp(email, password, displayName, 'user');
        
        // Always route to pending verification after signup
        this.router.navigate(['/auth/pending-verification']);
      } catch (error: any) {
        this.errorMessage = error;
      } finally {
        this.isLoading = false;
      }
    }
  }

  async signUpWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const userData = await this.authService.signInWithGoogle();
      // Check if email is verified for social logins
      if (userData.emailVerified) {
        this.routeToUserDashboard(userData.role);
      } else {
        this.router.navigate(['/auth/pending-verification']);
      }
    } catch (error: any) {
      this.errorMessage = error;
    } finally {
      this.isLoading = false;
    }
  }

  async signUpWithFacebook() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const userData = await this.authService.signInWithFacebook();
      // Check if email is verified for social logins
      if (userData.emailVerified) {
        this.routeToUserDashboard(userData.role);
      } else {
        this.router.navigate(['/auth/pending-verification']);
      }
    } catch (error: any) {
      this.errorMessage = error;
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.signUpForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
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
      case 'customer':
      default:
        this.router.navigate(['/customer']);
        break;
    }
  }
}