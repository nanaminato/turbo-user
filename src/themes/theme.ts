export type ThemeId = 'next-light' | 'next-dark' | 'system';

export interface ThemeDefinition {
  id: ThemeId;
  labelKey: string;
  colorScheme: 'light' | 'dark' | 'system';
}

/**
 * Add a new theme here and its token set in `src/theme/theme.scss`.
 * Theme ids are persisted in the user's dynamic configuration, so keep them stable.
 */
export const themeOptions: readonly ThemeDefinition[] = [
  {id: 'next-light', labelKey: 'themes.light', colorScheme: 'light'},
  {id: 'next-dark', labelKey: 'themes.dark', colorScheme: 'dark'},
  {id: 'system', labelKey: 'themes.system', colorScheme: 'system'},
];

export const DEFAULT_THEME: ThemeId = 'next-light';

// Kept for callers which only need the persisted ids.
export const themes: readonly ThemeId[] = themeOptions.map(({id}) => id);

export function getTheme(theme: string | undefined): ThemeDefinition {
  return themeOptions.find(({id}) => id === theme)
    ?? themeOptions.find(({id}) => id === DEFAULT_THEME)!;
}
