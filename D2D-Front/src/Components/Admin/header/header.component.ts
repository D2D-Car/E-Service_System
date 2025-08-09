import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ThemeService } from '../../../Services/theme.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/* =========================
  Interfaces
========================= */
interface Admin {
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
}

interface Notification {
  id: number;
  type: 'service' | 'completion' | 'payment' | 'registration' | 'system' | 'feedback';
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
}

interface SearchResult {
  id: string;
  type: 'customer' | 'service' | 'driver' | 'vehicle' | 'order';
  title: string;
  description: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  /* =========================
    Inputs & Outputs
  ========================= */
  @Input() isDarkMode: boolean = true;
  @Input() sidebarCollapsed: boolean = true;
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() themeToggle = new EventEmitter<void>();

  /* =========================
    State & Private Props
  ========================= */
  private destroy$ = new Subject<void>();
  autoTheme: boolean = false;

  // UI dropdowns
  showNotifications = false;
  showAdminDropdown = false;

  // Notifications
  notificationCount = 8;
  hasNotifications = true;

  // Admins
  currentAdminIndex = 0;
  admins: Admin[] = [
    { name: 'Ahmed Allam', email: 'ahmed.allam@d2d.com', role: 'Super Admin', avatar: '/assets/dashboard-img/avatar.png', status: 'online' },
    { name: 'Sarah Johnson', email: 'sarah.johnson@d2d.com', role: 'Admin', avatar: '/assets/dashboard-img/team-02.png', status: 'away' },
    { name: 'Yousef Elbaz', email: 'yousef.elbaz@d2d.com', role: 'Manager', avatar: '/assets/dashboard-img/team-01.png', status: 'busy' },
  ];

  notifications: Notification[] = [
    { id: 1, type: 'service', message: 'New brake service request from Ahmed Ali', time: '2 minutes ago', priority: 'high' },
    { id: 2, type: 'completion', message: 'Oil change completed for BMW X5 - Customer: Sara Mohamed', time: '15 minutes ago', priority: 'medium' },
    { id: 3, type: 'payment', message: 'Payment received - 850 EGP for tire replacement', time: '1 hour ago', priority: 'low' },
    { id: 4, type: 'registration', message: 'New customer registered: Omar Khaled', time: '2 hours ago', priority: 'medium' },
    { id: 5, type: 'system', message: 'Daily backup completed successfully', time: '3 hours ago', priority: 'low' },
    { id: 6, type: 'feedback', message: 'Excellent service rating (5 stars) from Mona Hassan', time: '4 hours ago', priority: 'medium' },
    { id: 7, type: 'service', message: 'Engine diagnostic requested for Mercedes C200', time: '5 hours ago', priority: 'high' },
    { id: 8, type: 'completion', message: 'AC repair completed for Hyundai Elantra', time: '6 hours ago', priority: 'medium' },
  ];

  // Search
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  showSearchResults: boolean = false;
  isSearching: boolean = false;
  searchTimeout: any;
  mockSearchData: SearchResult[] = [
    { id: '1', type: 'customer', title: 'Ahmed Ali', description: 'Customer - BMW X5 - Last service: Oil change', icon: 'fa-user', url: '/admin/customers' },
    { id: '3', type: 'driver', title: 'Mohamed Hassan', description: 'Driver - Available - 5 years experience', icon: 'fa-car', url: '/admin/drivers' },
    { id: '4', type: 'order', title: 'Order #2024-001', description: 'Order - In progress - Mercedes C200', icon: 'fa-file-invoice', url: '/admin/orders' }
  ]

  /* =========================
    Constructor & Lifecycle
  ========================= */
  constructor(private themeService: ThemeService, private router: Router) { }


  ngOnInit() {
    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => this.isDarkMode = isDark);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* =========================
    Getters
  ========================= */
  get currentAdmin(): Admin {
    return this.admins[this.currentAdminIndex];
  }

  /* =========================
    UI Toggles
  ========================= */
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebarToggle.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.themeToggle.emit();
  }

  selectTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.autoTheme = (theme === 'auto');
    if (theme === 'light' && this.isDarkMode) this.themeService.toggleTheme();
    if (theme === 'dark' && !this.isDarkMode) this.themeService.toggleTheme();
    this.themeToggle.emit();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showAdminDropdown = false;
  }

  toggleAdminDropdown(): void {
    this.showAdminDropdown = !this.showAdminDropdown;
    this.showNotifications = false;
  }

  /* =========================
    Notifications Handling
  ========================= */
  closeNotifications(): void { this.showNotifications = false; }
  closeAdminDropdown(): void { this.showAdminDropdown = false; }

  clearAllNotifications(): void {
    this.notifications = [];
    this.notificationCount = 0;
    this.hasNotifications = false;
  }

  dismissNotification(index: number): void {
    this.notifications.splice(index, 1);
    this.notificationCount = this.notifications.length;
    this.hasNotifications = this.notifications.length > 0;
  }

  /* =========================
    Admin Handling
  ========================= */
  switchAdmin(index: number): void {
    if (index === this.currentAdminIndex) return;
    this.currentAdminIndex = index;
    const profileSelector = document.querySelector('.profile-selector') as HTMLElement;
    if (profileSelector) {
      profileSelector.style.animation = 'pulse 0.5s ease';
      setTimeout(() => profileSelector.style.animation = '', 500);
    }
    setTimeout(() => this.showAdminDropdown = false, 800);
  }

  viewCurrentAdminProfile(): void { this.showAdminDropdown = false; }
  editProfile(): void { this.showAdminDropdown = false; }
  changePassword(): void { this.showAdminDropdown = false; }
  viewSettings(): void { this.showAdminDropdown = false; }

  logout(): void {
    const headerElement = document.querySelector('.professional-header') as HTMLElement;
    if (headerElement) headerElement.style.animation = 'fadeOut 0.5s ease';
    setTimeout(() => window.location.href = '/', 500);
    this.showAdminDropdown = false;
  }

  /* =========================
    Search Handling
  ========================= */
  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim();
    this.searchQuery = query;
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    if (!query) { this.clearSearch(); return; }
    this.isSearching = true;
    this.showSearchResults = true;
    this.searchTimeout = setTimeout(() => this.performSearch(query), 300);
  }

  performSearch(query: string): void {
    this.isSearching = false;
    this.searchResults = this.mockSearchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
    this.isSearching = false;
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }


  // Update the selectSearchResult method to navigate
  selectSearchResult(result: SearchResult): void {
    console.log('Navigating to:', result.url);
    this.router.navigate([result.url]);
    this.clearSearch();
  }

  // Add a new method for keyboard navigation
  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      // Handle keyboard navigation through results
      const results = document.querySelectorAll('.search-result-item');
      if (results.length > 0) {
        const activeResult = document.querySelector('.search-result-item:focus') as HTMLElement;
        let nextIndex = 0;

        if (activeResult) {
          const currentIndex = Array.from(results).indexOf(activeResult);
          if (event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % results.length;
          } else {
            nextIndex = (currentIndex - 1 + results.length) % results.length;
          }
        }

        (results[nextIndex] as HTMLElement).focus();
      }
    } else if (event.key === 'Enter' && this.searchResults.length > 0) {
      event.preventDefault();
      // Navigate to first result on Enter
      this.selectSearchResult(this.searchResults[0]);
    } else if (event.key === 'Escape') {
      this.clearSearch();
    }
  }

  /* =========================
    Event Listeners
  ========================= */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(): void {
    if (this.showNotifications) this.closeNotifications();
    if (this.showAdminDropdown) this.closeAdminDropdown();
    if (this.showSearchResults) this.clearSearch();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const searchContainer = (event.target as HTMLElement).closest('.search-container');
    if (!searchContainer && this.showSearchResults) this.clearSearch();
  }
}
