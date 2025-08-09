import {
  Component,
  HostListener,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements AfterViewInit {
  isFixed = false;
  public currentRoute: string = '';
  public activeSection: string = 'home';

  constructor(
    private readonly router: Router,
    private readonly el: ElementRef
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        // Set fixed only on landing page
        this.isFixed =
          this.currentRoute === '/' ||
          this.currentRoute === '/home' ||
          this.currentRoute.startsWith('/#');
      });

    // Listen for section change events from AppComponent
    window.addEventListener('sectionChange', (e: any) => {
      if (e?.detail) {
        this.activeSection = e.detail;
      }
    });
  }

  ngAfterViewInit(): void {
    // Initial shrink check
    this.handleNavbarShrink();
    // Set fixed on initial load
    const url = this.router.url;
    this.isFixed = url === '/' || url === '/home' || url.startsWith('/#');
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.handleNavbarShrink();
  }

  private handleNavbarShrink() {
    const navbar = this.el.nativeElement.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 10) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
  }

  isDashboardActive(): boolean {
    return (
      this.currentRoute?.includes('/customer/') ||
      this.currentRoute?.includes('/admin/') ||
      this.currentRoute?.includes('/technician/') ||
      this.currentRoute?.includes('/driver/')
    );
  }

  scrollToSection(sectionId: string, event: Event): void {
    this.activeSection = sectionId;
    event.preventDefault();
    console.log('Trying to scroll to:', sectionId);

    // First, navigate to home if not already there
    const currentUrl = this.router.url.split('#')[0];
    if (currentUrl !== '/' && currentUrl !== '/home') {
      console.log('Navigating to home first');
      this.router.navigate(['/']).then(() => {
        // Wait longer for navigation and DOM update
        setTimeout(() => {
          this.performScroll(sectionId);
        }, 1000);
      });
    } else {
      // If already on home page, just scroll
      console.log('Already on home page, scrolling directly');
      // Add small delay even when on home page
      setTimeout(() => {
        this.performScroll(sectionId);
      }, 100);
    }
  }

  private performScroll(sectionId: string): void {
    console.log('performScroll called for:', sectionId);

    // Try multiple ways to find the element
    let element =
      document.getElementById(sectionId) ??
      document.querySelector(`#${sectionId}`) ??
      document.querySelector(`[id="${sectionId}"]`);

    console.log('Found element:', element);

    if (element) {
      console.log('Element found, scrolling...');

      // Simple scroll using scrollIntoView
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Adjust for navbar after scrolling
      setTimeout(() => {
        const currentTop = window.pageYOffset;
        window.scrollTo({
          top: currentTop - 100,
          behavior: 'smooth',
        });
      }, 500);
    } else {
      console.error('Element not found:', sectionId);
      // Try to find all elements with IDs
      const allIds = Array.from(document.querySelectorAll('[id]')).map(
        (el) => el.id
      );
      console.log('Available elements with IDs:', allIds);
    }
  }
}
