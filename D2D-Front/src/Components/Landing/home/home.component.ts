import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private router: Router) {}

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    const onHome = this.router.url === '/' || this.router.url === '/home' || this.router.url.startsWith('/#');
    const el = document.getElementById(sectionId);

    if (onHome && el) {
      const navbarHeight = 80;
      const target = sectionId === 'home' ? 0 : el.getBoundingClientRect().top + window.scrollY - navbarHeight - 5;
      window.scrollTo({ top: target, behavior: 'smooth' });
      return;
    }
    // Navigate back to home then scroll
    this.router.navigate(['/'], { fragment: sectionId }).then(() => {
      setTimeout(() => {
        const targetEl = document.getElementById(sectionId);
        if (targetEl) {
          const navbarHeight2 = 80;
            const pos = sectionId === 'home' ? 0 : targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight2 - 5;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      }, 350);
    });
  }
}
