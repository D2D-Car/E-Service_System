import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  AfterViewInit,
} from '@angular/core';
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
import { ContactComponent } from '../Components/Landing/contact/contact.component';
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
    ContactComponent,
    HomeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'D2D Car';
  public isHomePage = false;
  public isDashboardPage = false;
  public isAdminPage = false;
  private readonly routeSubscription?: Subscription;
  private isScrolling = false;
  public activeSection: string = 'home';
  private sectionObserver?: IntersectionObserver;

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

        // Toggle home-page body class (used for snap / styling)
        if (this.isHomePage) {
          document.body.classList.add('home-page');
        } else {
          document.body.classList.remove('home-page');
        }
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

  ngAfterViewInit(): void {
    // Initialize reveal animations for landing sections
    if (this.isHomePage) {
      this.initSectionObserver();
    }

    // Also (re-)init observer when route changes to home
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isHomePage) {
          // Delay a tick to ensure DOM rendered
          setTimeout(() => this.initSectionObserver(), 50);
        } else if (this.sectionObserver) {
          this.sectionObserver.disconnect();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }
  }

  private initSectionObserver() {
    const container = document.querySelector('.landing-scroll-container');
    if (!container) return;

    const sections: Element[] = Array.from(
      container.querySelectorAll('.landing-section')
    );

    // Disconnect previous observer if exists
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }

    // Add base class so they are hidden before animation
    sections.forEach((s) => s.classList.add('will-animate'));

    // Ensure first (home) section visible immediately
    const first = sections[0];
    if (first && !first.classList.contains('visible')) {
      first.classList.add('visible');
    }

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            // Stagger children inside the section (optional)
            el.classList.add('visible');
            // Animate only once
            this.sectionObserver?.unobserve(el);
          }
        });
      },
      {
        root: null,
        threshold: 0.2, // 20% of section visible triggers animation
        rootMargin: '0px 0px -10% 0px',
      }
    );

    sections.forEach((section) => this.sectionObserver?.observe(section));
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
      const navbarHeight = 80;
      const elementTop = element.offsetTop;
      let scrollTarget: number;

      if (fragment === 'home') {
        // Home section should start from the very top
        scrollTarget = 0;
      } else {
        // Other sections should start just below navbar with small padding
        scrollTarget = elementTop - navbarHeight - 5; // 5px padding for perfect alignment
      }

      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth',
      });
    }
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (!this.isHomePage) return;
    if (this.isScrolling) return;
    const container = document.querySelector('.landing-scroll-container');
    if (!container) return;
    const sections = Array.from(container.querySelectorAll('.landing-section'));
    const currentSection = sections.find((section: Element) => {
      const rect = (section as HTMLElement).getBoundingClientRect();
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
    if (nextSection?.classList.contains('landing-section')) {
      event.preventDefault(); // Block native multi scroll momentum
      const navbarHeight = 80;
      const targetEl = nextSection as HTMLElement;
      const targetTopRaw = targetEl.offsetTop;
      const targetTop =
        targetEl.id === 'home' ? 0 : targetTopRaw - navbarHeight - 5;
      this.isScrolling = true;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
      // Use scroll event end detection fallback via timeout
      setTimeout(() => {
        this.isScrolling = false;
        this.updateActiveSection();
      }, 700);
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
    const navbarHeight = 80;
    let found = false;

    // Find section that's currently most visible in the viewport (accounting for navbar)
    for (const section of sections) {
      const rect = (section as HTMLElement).getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      // Consider navbar height and use center of visible viewport
      const viewportCenter =
        navbarHeight + (window.innerHeight - navbarHeight) / 2;

      // Section is active if it contains the center of the visible viewport
      if (sectionTop <= viewportCenter && sectionBottom > viewportCenter) {
        this.activeSection = section.id;
        found = true;
        break;
      }
    }

    // Fallback: use the first section if none found
    if (!found && sections.length) {
      const scrollTop = window.pageYOffset;

      if (scrollTop < 50) {
        // Very top = home
        this.activeSection = 'home';
      } else {
        // Find section based on scroll position
        for (const section of sections) {
          const elementTop = (section as HTMLElement).offsetTop;
          const nextSibling = section.nextElementSibling as HTMLElement;
          const nextTop = nextSibling ? nextSibling.offsetTop : Infinity;

          if (
            scrollTop + navbarHeight >= elementTop &&
            scrollTop + navbarHeight < nextTop
          ) {
            this.activeSection = section.id;
            found = true;
            break;
          }
        }

        // Last resort: use first section
        if (!found) {
          this.activeSection = (sections[0] as HTMLElement).id;
        }
      }
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
