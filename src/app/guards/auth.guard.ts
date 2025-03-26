import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.data['role'] as UserRole;

    if (requiredRole) {
      if (currentUser.role === 'Librarian') {
        if (requiredRole !== 'Librarian') {
          this.router.navigate(['/manage']);
          return false;
        }
      } else {
        if (requiredRole !== 'Member') {
          this.router.navigate(['/books']);
          return false;
        }
      }
    }

    return true;
  }
}
