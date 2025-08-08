import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'd2d-theme-preference';

  private isDarkModeSubject = new BehaviorSubject<boolean>(true); // Default to dark theme
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    let isDark = true; // Default to dark theme
    
    if (savedTheme) {
      isDark = savedTheme === 'dark';
    } else {
      // Check system preference if no saved theme
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    this.isDarkModeSubject.next(isDark);
    this.applyTheme(isDark);
  }

  public toggleTheme(): void {
    const currentTheme = this.isDarkModeSubject.value;
    const newTheme = !currentTheme;
    this.isDarkModeSubject.next(newTheme);
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  }

  public setTheme(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);
    this.applyTheme(isDark);
    this.saveTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    const body = document.body;
    const html = document.documentElement;
    
    if (isDark) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      html.setAttribute('data-theme', 'dark');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      html.setAttribute('data-theme', 'light');
    }
    
    // Trigger a custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { isDark } 
    }));
  }

  private saveTheme(isDark: boolean): void {
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
  }

  public get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  // Listen to system theme changes
  public initializeSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem(this.THEME_KEY);
      if (!savedTheme) {
        this.setTheme(e.matches);
      }
    });
  }
}
