import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'admin-dashboard-theme';
  private readonly SIDEBAR_KEY = 'admin-sidebar-collapsed';
  
  // Theme state
  private _isDarkMode = new BehaviorSubject<boolean>(true);
  public isDarkMode$ = this._isDarkMode.asObservable();
  
  // Sidebar state
  private _sidebarCollapsed = new BehaviorSubject<boolean>(false);
  public sidebarCollapsed$ = this._sidebarCollapsed.asObservable();

  constructor() {
    this.loadThemeFromStorage();
    this.loadSidebarStateFromStorage();
    this.applyTheme();
  }

  // Theme management
  get isDarkMode(): boolean {
    return this._isDarkMode.value;
  }

  toggleTheme(): void {
    const newTheme = !this._isDarkMode.value;
    console.log('ThemeService: Toggling from', this._isDarkMode.value, 'to', newTheme);
    this._isDarkMode.next(newTheme);
    this.saveThemeToStorage();
    this.applyTheme();
  }

  setTheme(isDark: boolean): void {
    this._isDarkMode.next(isDark);
    this.saveThemeToStorage();
    this.applyTheme();
  }

  private loadThemeFromStorage(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this._isDarkMode.next(savedTheme === 'dark');
    } else {
      // Default to dark theme
      this._isDarkMode.next(true);
      this.saveThemeToStorage();
    }
  }

  private saveThemeToStorage(): void {
    const theme = this._isDarkMode.value ? 'dark' : 'light';
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private applyTheme(): void {
    // Apply theme classes to body for global theming
    document.body.classList.remove('dark-theme', 'light-theme');
    
    // Force a small delay to ensure classes are removed
    setTimeout(() => {
      if (this._isDarkMode.value) {
        document.body.classList.add('dark-theme');
        console.log('Applied dark theme to body');
      } else {
        document.body.classList.add('light-theme');
        console.log('Applied light theme to body');
      }
    }, 10);
  }

  // Sidebar management
  get sidebarCollapsed(): boolean {
    return this._sidebarCollapsed.value;
  }

  toggleSidebar(): void {
    const newState = !this._sidebarCollapsed.value;
    this._sidebarCollapsed.next(newState);
    this.saveSidebarStateToStorage();
  }

  setSidebarState(collapsed: boolean): void {
    this._sidebarCollapsed.next(collapsed);
    this.saveSidebarStateToStorage();
  }

  private loadSidebarStateFromStorage(): void {
    const savedSidebarState = localStorage.getItem(this.SIDEBAR_KEY);
    if (savedSidebarState) {
      this._sidebarCollapsed.next(savedSidebarState === 'true');
    }
  }

  private saveSidebarStateToStorage(): void {
    localStorage.setItem(this.SIDEBAR_KEY, this._sidebarCollapsed.value.toString());
  }

  // Reset all settings
  resetToDefaults(): void {
    this.setTheme(true); // Dark theme
    this.setSidebarState(false); // Expanded sidebar
  }

  // Clear all stored settings
  clearStorage(): void {
    localStorage.removeItem(this.THEME_KEY);
    localStorage.removeItem(this.SIDEBAR_KEY);
    this.resetToDefaults();
  }
}
