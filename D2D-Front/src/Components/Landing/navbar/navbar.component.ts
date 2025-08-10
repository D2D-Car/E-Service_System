import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  showSearch = false;
  scrolled = false;
  private scrolling = false;
  activeSection = 'home';

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Initialize active section based on current hash if present
    const hash = window.location.hash.replace('#', '');
    if (hash) this.activeSection = hash;
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 50;
  }

  @HostListener('window:sectionChange', ['$event'])
  onSectionChange(ev: CustomEvent) {
    this.activeSection = ev.detail;
  }

  isDashboardActive(): boolean {
    return (
      this.router.url.includes('/customer/') ||
      this.router.url.includes('/technician/') ||
      this.router.url.includes('/driver/')
    );
  }

  scrollTo(sectionId: string, event: Event) {
    // Only prevent default if we're going to handle smooth scrolling ourselves
    event.preventDefault();
    const onComposite =
      this.router.url === '/' ||
      this.router.url === '/home' ||
      this.router.url.startsWith('/#');
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
          this.performSmoothScroll(
            sectionId,
            target,
            event.target as HTMLElement
          );
        }
      }, 350); // tuned delay
    });
  }

  private performSmoothScroll(
    sectionId: string,
    el: HTMLElement,
    clickedLink?: HTMLElement
  ) {
    this.scrolling = true;
    this.activeSection = sectionId;

    if (clickedLink) clickedLink.classList.add('scrolling');

    const navbarEl = document.querySelector('.navbar');
    const navbarHeight =
      navbarEl instanceof HTMLElement ? navbarEl.offsetHeight : 80;

    // Use offsetTop (faster & stable after images load) then compensate for navbar
    const rawTop = el.offsetTop;
    const desiredTop =
      sectionId === 'home' ? 0 : Math.max(rawTop - navbarHeight - 5, 0);

    window.scrollTo({ top: desiredTop, behavior: 'smooth' });

    // Secondary correction after smooth scroll (layout shifts / images async) using rAF chain
    let attempts = 0;
    const correctIfNeeded = () => {
      attempts++;
      const currentOffset = window.scrollY;
      // If difference > 4px, adjust without animation
      if (Math.abs(currentOffset - desiredTop) > 4 && attempts < 6) {
        window.scrollTo({ top: desiredTop, behavior: 'auto' });
        requestAnimationFrame(correctIfNeeded);
      }
    };
    requestAnimationFrame(correctIfNeeded);

    // Update hash (no jump) so refresh / share keeps section
    if (history.replaceState) history.replaceState(null, '', `#${sectionId}`);

    // Close mobile collapse if open
    const collapse = document.getElementById('navbarNavDropdown');
    if (collapse?.classList.contains('show')) {
      // Bootstrap collapse via toggler button (if present)
      const toggler = document.querySelector('.navbar-toggler');
      (toggler as HTMLElement | null)?.click();
    }

    el.classList.add('scroll-pulse');
    setTimeout(() => {
      el.classList.remove('scroll-pulse');
      if (clickedLink) clickedLink.classList.remove('scrolling');
    }, 2000);
    setTimeout(() => (this.scrolling = false), 1500);
  }
}
