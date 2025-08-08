import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../../Services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="theme-toggle-btn" 
      (click)="toggleTheme()" 
      [attr.aria-label]="'Switch to ' + (isDarkMode ? 'light' : 'dark') + ' theme'"
      [title]="'Switch to ' + (isDarkMode ? 'light' : 'dark') + ' theme'">
      <div class="toggle-icon">
        <i *ngIf="isDarkMode" class="fas fa-sun"></i>
        <i *ngIf="!isDarkMode" class="fas fa-moon"></i>
      </div>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--text-primary);
      position: relative;
      overflow: hidden;
    }

    .theme-toggle-btn:hover {
      background: var(--hover-bg);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--shadow);
    }

    .theme-toggle-btn:active {
      transform: translateY(0);
    }

    .toggle-icon {
      font-size: 1.1rem;
      transition: all 0.3s ease;
    }

    .theme-toggle-btn:hover .toggle-icon {
      transform: rotate(15deg);
    }

    /* Animation for theme switch */
    .theme-toggle-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--primary-color);
      border-radius: 50%;
      transform: scale(0);
      transition: transform 0.3s ease;
      z-index: -1;
    }

    .theme-toggle-btn:active::before {
      transform: scale(1);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .theme-toggle-btn {
        width: 36px;
        height: 36px;
      }
      
      .toggle-icon {
        font-size: 1rem;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  private subscription: Subscription = new Subscription();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.themeService.isDarkMode$.subscribe(isDark => {
        this.isDarkMode = isDark;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
