import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user && user.emailVerified) {
          return true;
        } else if (user && !user.emailVerified) {
          return this.router.createUrlTree(['/auth/pending-verification']);
        } else {
          return this.router.createUrlTree(['/auth/login']);
        }
      })
    );
  }

  // Helper method to route users to their appropriate dashboard
  private routeToUserDashboard(userType: string): UrlTree {
    switch (userType) {
      case 'admin':
        return this.router.createUrlTree(['/admin']);
      case 'driver':
        return this.router.createUrlTree(['/driver']);
      case 'technician':
        return this.router.createUrlTree(['/technician']);
      case 'user':
      default:
        return this.router.createUrlTree(['/customer']);
    }
  }
}