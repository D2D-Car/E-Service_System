import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(public router: Router) { }


  isDashboardRoute(): boolean {
    const url = this.router.url;
    return (
      url.includes('/customer') ||
      url.includes('/driver') ||
      url.includes('/technician')
    );
  }
}
