import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../Services/theme.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Input() isDarkMode = true; // Default to dark theme
  
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
        this.collapsed = collapsed;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/admin/dashboard',
      badge: 0,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: 'fas fa-users',
      route: '/admin/customers',
      badge: 125,
    },
    {
      id: 'drivers',
      label: 'Drivers',
      icon: 'fas fa-id-card',
      route: '/admin/drivers',
      badge: 45,
    },
    {
      id: 'technicians',
      label: 'Technicians',
      icon: 'fas fa-user-cog',
      route: '/admin/technicians',
      badge: 12,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: 'fas fa-clipboard-list',
      route: '/admin/orders',
      badge: 23,
    },
    {
      id: 'stock',
      label: 'Stock',
      icon: 'fas fa-boxes',
      route: '/admin/stock',
      badge: 8,
    },
    {
      id: 'financial',
      label: 'Financial',
      icon: 'fas fa-chart-line',
      route: '/admin/financial',
      badge: 0,
    },
  ];

  quickActions = [
    {
      label: 'New Order',
      icon: 'fas fa-plus-circle',
      action: 'newOrder',
      color: '#10b981',
    },
    {
      label: 'Add Customer',
      icon: 'fas fa-user-plus',
      action: 'addCustomer',
      color: '#3b82f6',
    },
    {
      label: 'Reports',
      icon: 'fas fa-chart-bar',
      action: 'reports',
      color: '#f59e0b',
    },
  ];

  handleQuickAction(action: string): void {
    switch (action) {
      case 'newOrder':
        this.router.navigate(['/admin/orders']);
        break;
      case 'addCustomer':
        this.router.navigate(['/admin/customers']);
        break;
      case 'reports':
        this.router.navigate(['/admin/financial']);
        break;
    }
  }

  logout(): void {
    // Simple logout without any alerts
    console.log('User signed out');
    // You can add additional logout logic here like clearing user data
  }
}
