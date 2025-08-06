import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../../Services/theme.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  currentTime = new Date();
  greeting = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly themeService: ThemeService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Subscribe to theme changes from the theme service
      this.themeService.isDarkMode$
        .pipe(takeUntil(this.destroy$))
        .subscribe((isDark) => {
          this.isDarkMode = isDark;
          // Theme is automatically applied by the service
        });

      // Set greeting based on time
      this.setGreeting();

      // Update time every minute
      setInterval(() => {
        this.currentTime = new Date();
        this.setGreeting();
      }, 60000);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(): void {
    // Use the theme service to toggle theme
    this.themeService.toggleTheme();
  }

  private setGreeting(): void {
    const hour = this.currentTime.getHours();
    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 18) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  getFormattedTime(): string {
    return this.currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  getFormattedDate(): string {
    return this.currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
