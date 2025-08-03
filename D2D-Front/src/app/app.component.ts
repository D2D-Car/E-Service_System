import { Component } from '@angular/core';
import { ServicesComponent } from '../Components/Landing/services/services.component';
import { NavbarComponent } from '../Components/Landing/navbar/navbar.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ServicesComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'D2D Car';
  public isHomePage = false;

  constructor(public router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage = event.urlAfterRedirects === '/';
    });
  }
}
