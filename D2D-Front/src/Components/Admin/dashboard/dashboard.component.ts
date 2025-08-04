import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ThemeService } from '../../../Services/theme.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  isDarkMode: boolean = true;
  sidebarCollapsed: boolean = false;
  showDashboardContent: boolean = true;
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Subscribe to theme changes
    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
      });

    // Subscribe to sidebar state changes
    this.themeService.sidebarCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collapsed => {
        this.sidebarCollapsed = collapsed;
      });
    
    // Listen to router events to determine when to show dashboard content
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      // Show dashboard content only when at the main admin route or dashboard route
      this.showDashboardContent = event.url === '/admin' || event.url === '/admin/dashboard';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSidebarToggle() {
    this.themeService.toggleSidebar();
  }

  onThemeToggle() {
    this.themeService.toggleTheme();
  }

  testThemeToggle() {
    console.log('Manual theme toggle test');
    this.themeService.toggleTheme();
  }
}
