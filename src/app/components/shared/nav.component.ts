import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  isAuthenticated = false;
  isLibrarian = false;
  userName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.userName = user?.name || null;
      this.isLibrarian = user?.role === 'Librarian';

      if (this.isAuthenticated) {
        if (this.isLibrarian) {
          this.router.navigate(['/manage']);
        } else {
          this.router.navigate(['/books']);
        }
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
