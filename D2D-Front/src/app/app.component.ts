import { Component } from '@angular/core';
import { ServicesComponent } from '../Components/Landing/services/services.component';
import { NavbarComponent } from '../Components/Landing/navbar/navbar.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TechniciansComponent } from '../Components/Landing/technicians/technicians.component';
import { FooterComponent } from '../Components/Landing/footer/footer.component';
import { FeedbackComponent } from '../Components/Landing/feedback/feedback.component';
import { AboutComponent } from '../Components/Landing/about/about.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ServicesComponent,
    NavbarComponent,
    TechniciansComponent,
    FeedbackComponent,
    FooterComponent,
    AboutComponent
  ],
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
