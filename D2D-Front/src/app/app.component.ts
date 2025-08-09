import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ServicesComponent } from '../Components/Landing/services/services.component';
import { NavbarComponent } from '../Components/Landing/navbar/navbar.component';
import {
  RouterOutlet,
  Router,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TechniciansComponent } from '../Components/Landing/technicians/technicians.component';
import { FooterComponent } from '../Components/Landing/footer/footer.component';
import { HomeComponent } from '../Components/Landing/home/home.component';
import { FeedbackComponent } from '../Components/Landing/feedback/feedback.component';
import { AboutComponent } from '../Components/Landing/about/about.component';
import { TestimonialsComponent } from '../Components/Landing/testimonials/testimonials.component';
import { Subscription } from 'rxjs';

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
    AboutComponent,
    TestimonialsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'D2D Car';
  public isHomePage = false;
  public isDashboardPage = false;
  public isAdminPage = false;
  private readonly routeSubscription?: Subscription;
  private isScrolling = false;
  public activeSection: string = 'home';

  constructor(
    public router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.isHomePage =
          url === '/' || url === '/home' || url.startsWith('/#');
        this.isDashboardPage =
          url.includes('/dashboard') || url.includes('/admin');
        this.isAdminPage = url.includes('/admin');

        // Add/remove admin-page class to body
        if (this.isAdminPage) {
          document.body.classList.add('admin-page');
        } else {
          document.body.classList.remove('admin-page');
        }

        this.isDashboardPage =
          url.includes('/driver/') ||
          url.includes('/admin/') ||
          url.includes('/technician/') ||
          url.includes('/customer/');

        // Handle fragment scrolling after navigation
        this.handleFragmentScroll(url);
      });
  }

  ngOnInit(): void {
    // Handle initial fragment if present
    setTimeout(() => {
      const fragment = this.activatedRoute.snapshot.fragment;
      if (fragment) {
        this.scrollToFragment(fragment);
      }
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private handleFragmentScroll(url: string): void {
    const fragmentIndex = url.indexOf('#');
    if (fragmentIndex > -1) {
      const fragment = url.substring(fragmentIndex + 1);
      setTimeout(() => {
        this.scrollToFragment(fragment);
      }, 100);
    }
  }

  private scrollToFragment(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (!this.isHomePage) return;
    if (this.isScrolling) return;
    const container = document.querySelector('.landing-scroll-container');
    if (!container) return;
    const sections = Array.from(container.querySelectorAll('.landing-section'));
    const currentSection = sections.find((section: any) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 10 && rect.bottom > 10;
    });
    if (!currentSection) return;
    let nextSection: Element | null = null;
    if (event.deltaY > 0) {
      // Scroll Down
      nextSection = currentSection.nextElementSibling;
    } else if (event.deltaY < 0) {
      // Scroll Up
      nextSection = currentSection.previousElementSibling;
    }
    if (nextSection && nextSection.classList.contains('landing-section')) {
      this.isScrolling = true;
      (nextSection as HTMLElement).scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        this.isScrolling = false;
        this.updateActiveSection();
      }, 800);
      event.preventDefault();
    }
  }

  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])
  onScrollOrResize() {
    if (this.isHomePage) {
      this.updateActiveSection();
    }
  }

  private updateActiveSection() {
    const container = document.querySelector('.landing-scroll-container');
    if (!container) return;
    const sections = Array.from(container.querySelectorAll('.landing-section'));
    let found = false;
    for (const section of sections) {
      const rect = (section as HTMLElement).getBoundingClientRect();
      if (
        rect.top <= window.innerHeight / 2 &&
        rect.bottom > window.innerHeight / 2
      ) {
        this.activeSection = section.id;
        found = true;
        break;
      }
    }
    if (!found && sections.length) {
      this.activeSection = (sections[0] as HTMLElement).id;
    }
    // Emit custom event for navbar
    window.dispatchEvent(
      new CustomEvent('sectionChange', { detail: this.activeSection })
    );
  }

  goToAdminDashboard(): void {
    if (this.isAdminPage) {
      // If currently on admin page, go back to website home
      this.router.navigate(['/home']);
    } else {
      // If not on admin page, go to admin dashboard
      this.router.navigate(['/admin']);
    }
  }
}
