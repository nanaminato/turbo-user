import {DOCUMENT} from '@angular/common';
import {inject, Injectable} from '@angular/core';
import {DEFAULT_THEME, getTheme, ThemeId} from '../../themes/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherService {
  private readonly document = inject(DOCUMENT);
  private readonly systemColorScheme =
    typeof window === 'undefined' ? undefined : window.matchMedia('(prefers-color-scheme: dark)');

  private selectedTheme: ThemeId = DEFAULT_THEME;

  constructor() {
    this.systemColorScheme?.addEventListener('change', () => {
      if (this.selectedTheme === 'system') {
        this.applyTheme('system');
      }
    });
  }

  /** Returns the normalized value that should be persisted in configuration. */
  load(theme: string | undefined): ThemeId {
    const selectedTheme = getTheme(theme).id;
    this.selectedTheme = selectedTheme;
    this.applyTheme(selectedTheme);
    return selectedTheme;
  }

  get currentTheme(): ThemeId {
    return this.selectedTheme;
  }

  private applyTheme(selectedTheme: ThemeId): void {
    const definition = getTheme(selectedTheme);
    const resolvedTheme = definition.colorScheme === 'system'
      ? (this.systemColorScheme?.matches ? 'next-dark' : 'next-light')
      : definition.id;
    const root = this.document.documentElement;

    root.dataset['theme'] = resolvedTheme;
    root.dataset['themePreference'] = selectedTheme;
    root.style.colorScheme = resolvedTheme === 'next-dark' ? 'dark' : 'light';
  }
}
