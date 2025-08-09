import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, CanActivateChild, CanMatch, Route, UrlSegment } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
// Unified auth guard implementing multiple guard interfaces for full coverage
export class AuthGuard implements CanActivate, CanActivateChild, CanMatch {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  private evaluateAccess(routePath: string): boolean | UrlTree {
    const currentUser = this.authService.getCurrentUser();
    const userData = this.authService.getUserData();

    // Not logged in
    if (!currentUser || !userData) {
      return this.router.createUrlTree(['/auth/login']);
    }

    // Normalize path (only first segment matters for role)
    if (routePath.includes('/')) {
      routePath = routePath.split('/')[0];
    }

    // Role checks
    if (routePath === 'admin' && userData.role !== 'admin') {
      return this.router.createUrlTree(['/auth/login']);
    }
    if (routePath.startsWith('technician') && userData.role !== 'technician') {
      return this.router.createUrlTree(['/auth/login']);
    }
    if (routePath.startsWith('driver') && userData.role !== 'driver') {
      return this.router.createUrlTree(['/auth/login']);
    }
    if (routePath.startsWith('customer') && userData.role !== 'user') {
      return this.router.createUrlTree(['/auth/login']);
    }

    // Admin-created accounts bypass email verification
    if (['admin', 'driver', 'technician'].includes(userData.role)) {
      return true;
    }

    // Regular user must verify email
    if (currentUser.emailVerified || userData.emailVerified) {
      return true;
    }
    return this.router.createUrlTree(['/auth/pending-verification']);
  }

  private guardObservable(routePath: string): Observable<boolean | UrlTree> {
    // Wait up to 500ms for user data (handles direct URL entry before auth state fires)
    return this.authService.userData$.pipe(
      switchMap((ud) => {
        if (ud) return of(ud); // already have data
        return timer(150).pipe(
          switchMap(() => this.authService.userData$.pipe(take(1)))
        );
      }),
      take(1),
      map(() => this.evaluateAccess(routePath))
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const routePath = route.routeConfig?.path || '';
    return this.guardObservable(routePath);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const routePath = childRoute.parent?.routeConfig?.path || childRoute.routeConfig?.path || '';
    return this.guardObservable(routePath);
  }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | boolean | UrlTree {
    const routePath = route.path || '';
    return this.evaluateAccess(routePath);
  }
}