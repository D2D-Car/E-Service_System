import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-pending-verification',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pending-verification.component.html',
  styleUrls: ['./pending-verification.component.css']
})
export class PendingVerificationComponent implements OnInit, OnDestroy {
  userEmail = '';
  isResending = false;
  resendMessage = '';
  resendSuccess = false;
  checkingVerification = false;
  private verificationCheckSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.userEmail = user.email || '';

    // Check if already verified
    if (user.emailVerified) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Start checking verification status every 3 seconds
    this.startVerificationCheck();
  }

  ngOnDestroy() {
    if (this.verificationCheckSubscription) {
      this.verificationCheckSubscription.unsubscribe();
    }
  }

  private startVerificationCheck() {
    this.verificationCheckSubscription = interval(3000).subscribe(async () => {
      this.checkingVerification = true;
      try {
        const isVerified = await this.authService.checkEmailVerification();
        if (isVerified) {
          // Always route to customer dashboard for verified users
          this.router.navigate(['/customer']);
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      } finally {
        this.checkingVerification = false;
      }
    });
  }

  async resendVerification() {
    this.isResending = true;
    this.resendMessage = '';
    this.resendSuccess = false;

    try {
      const result = await this.authService.sendEmailVerification();
      this.resendSuccess = result.success;
      this.resendMessage = result.message;
      
      // If email was sent successfully, show a more specific message
      if (result.success) {
        this.resendMessage = 'Verification email sent successfully! Please check your inbox and spam folder.';
      }
    } catch (error: any) {
      this.resendSuccess = false;
      this.resendMessage = error.message || 'Failed to send verification email. Please try again.';
    } finally {
      this.isResending = false;
    }
  }

  async signOut() {
    await this.authService.signOut();
  }

  getMaskedEmail(): string {
    if (!this.userEmail) return '';
    
    const [localPart, domain] = this.userEmail.split('@');
    if (localPart.length <= 2) return this.userEmail;
    
    const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
    return `${maskedLocal}@${domain}`;
  }
}