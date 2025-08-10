import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  showSearch = false;
  scrolled = false;
  private scrolling = false;
  activeSection: string = 'home';

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Initialize active section based on current hash if present
    const hash = window.location.hash.replace('#','');
    if (hash) this.activeSection = hash;
  }

  toggleSearch() { this.showSearch = !this.showSearch; }

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 50; }

  @HostListener('window:sectionChange', ['$event'])
  onSectionChange(ev: CustomEvent) { this.activeSection = ev.detail; }

  isDashboardActive(): boolean {
    return this.router.url.includes('/customer/') ||
      this.router.url.includes('/technician/') ||
      this.router.url.includes('/driver/');
  }

  scrollTo(sectionId: string, event: Event) {
  // Only prevent default if we're going to handle smooth scrolling ourselves
  event.preventDefault();
    const onComposite = this.router.url === '/' || this.router.url === '/home' || this.router.url.startsWith('/#');
    const el = document.getElementById(sectionId);

    if (onComposite && el) {
      this.performSmoothScroll(sectionId, el, event.target as HTMLElement);
      return;
    }

    // Not on composite landing page yet -> navigate then apply effect after render
    this.router.navigate(['/'], { fragment: sectionId }).then(() => {
      // Wait a tick for the landing sections to render, then smooth scroll with offset
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          this.performSmoothScroll(sectionId, target, event.target as HTMLElement);
        }
      }, 350); // tuned delay
    });
  }

  private performSmoothScroll(sectionId: string, el: HTMLElement, clickedLink?: HTMLElement) {
    this.scrolling = true;
    this.activeSection = sectionId;

    if (clickedLink) clickedLink.classList.add('scrolling');

    const navbarHeight = 80;
    const elementTop = el.offsetTop;
    const scrollTarget = sectionId === 'home' ? 0 : Math.max(elementTop - navbarHeight - 5, 0);

    // Prefer native scrollIntoView if available (handles dynamic layout better)
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if ('scrollIntoView' in el) {
      // Use block:start then adjust if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // After a short delay adjust for fixed navbar precisely
      setTimeout(() => {
        const adjusted = el.getBoundingClientRect().top + window.scrollY - 85; // navbar height + padding
        window.scrollTo({ top: adjusted, behavior: 'auto' });
      }, 350);
    } else {
      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }

    el.classList.add('scroll-pulse');
    setTimeout(() => {
      el.classList.remove('scroll-pulse');
      if (clickedLink) clickedLink.classList.remove('scrolling');
    }, 2000);
    setTimeout(() => (this.scrolling = false), 1500);
  }
}
