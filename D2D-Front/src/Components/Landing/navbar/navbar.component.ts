import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
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
    event.preventDefault();
    const onComposite = this.router.url === '/' || this.router.url === '/home' || this.router.url.startsWith('/#');
    const el = document.getElementById(sectionId);

    if (onComposite && el) {
      this.scrolling = true;
      this.activeSection = sectionId;
      
      // Add scrolling class to the clicked link
      const clickedLink = event.target as HTMLElement;
      clickedLink.classList.add('scrolling');
      
      // Calculate precise scroll position accounting for navbar
      const navbarHeight = 80;
      const elementTop = el.offsetTop;
      let scrollTarget: number;
      
      if (sectionId === 'home') {
        // Home section should start from the very top
        scrollTarget = 0;
      } else {
        // Other sections should start just below navbar with small padding
        scrollTarget = elementTop - navbarHeight - 5;
      }
      
      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
      
      el.classList.add('scroll-pulse');
      setTimeout(() => {
        el.classList.remove('scroll-pulse');
        clickedLink.classList.remove('scrolling');
      }, 2000); // Match animation duration
      setTimeout(() => (this.scrolling = false), 1500);
      return;
    }

    // Not on composite landing page yet -> navigate then apply effect after render
    this.router.navigate(['/'], { fragment: sectionId }).then(() => {
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.classList.add('scroll-pulse');
          setTimeout(() => target.classList.remove('scroll-pulse'), 2000);
        }
      }, 400); // slight delay to ensure DOM present
    });
  }
}
