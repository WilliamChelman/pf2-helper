import { Injectable, Signal, signal } from '@angular/core';
import { ColorScheme } from './cards-background.component';

export interface ColorSchemeDefinition {
  name: ColorScheme;
  displayName: string;
  description: string;
  colors: {
    radial1: string;
    radial2: string;
    linear1: string;
    linear2: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CardsBackgroundService {
  private readonly STORAGE_KEY = 'pf2-helper-color-scheme';
  private currentScheme = signal<ColorScheme>('default');

  readonly colorSchemes: ColorSchemeDefinition[] = [
    {
      name: 'default',
      displayName: 'Default',
      description: 'Classic brown and green tones',
      colors: {
        radial1: 'rgba(139, 69, 19, 0.1)',
        radial2: 'rgba(160, 82, 45, 0.1)',
        linear1: 'rgba(34, 139, 34, 0.05)',
        linear2: 'rgba(139, 69, 19, 0.05)',
      },
    },
    {
      name: 'forest',
      displayName: 'Forest',
      description: 'Deep green woodland theme',
      colors: {
        radial1: 'rgba(34, 139, 34, 0.15)',
        radial2: 'rgba(85, 107, 47, 0.1)',
        linear1: 'rgba(0, 100, 0, 0.08)',
        linear2: 'rgba(34, 139, 34, 0.06)',
      },
    },
    {
      name: 'ocean',
      displayName: 'Ocean',
      description: 'Cool blue sea tones',
      colors: {
        radial1: 'rgba(70, 130, 180, 0.12)',
        radial2: 'rgba(0, 191, 255, 0.1)',
        linear1: 'rgba(25, 25, 112, 0.06)',
        linear2: 'rgba(70, 130, 180, 0.05)',
      },
    },
    {
      name: 'sunset',
      displayName: 'Sunset',
      description: 'Warm orange and red hues',
      colors: {
        radial1: 'rgba(255, 140, 0, 0.12)',
        radial2: 'rgba(255, 69, 0, 0.1)',
        linear1: 'rgba(255, 215, 0, 0.06)',
        linear2: 'rgba(255, 140, 0, 0.05)',
      },
    },
    {
      name: 'purple',
      displayName: 'Purple',
      description: 'Rich purple and violet tones',
      colors: {
        radial1: 'rgba(138, 43, 226, 0.12)',
        radial2: 'rgba(75, 0, 130, 0.1)',
        linear1: 'rgba(147, 112, 219, 0.06)',
        linear2: 'rgba(138, 43, 226, 0.05)',
      },
    },
    {
      name: 'warm',
      displayName: 'Warm',
      description: 'Cozy orange and brown tones',
      colors: {
        radial1: 'rgba(210, 105, 30, 0.12)',
        radial2: 'rgba(255, 165, 0, 0.1)',
        linear1: 'rgba(255, 140, 0, 0.06)',
        linear2: 'rgba(210, 105, 30, 0.05)',
      },
    },
  ];

  constructor() {
    this.loadColorSchemeFromStorage();
  }

  getCurrentScheme(): Signal<ColorScheme> {
    return this.currentScheme.asReadonly();
  }

  setColorScheme(schemeName: ColorScheme): void {
    this.currentScheme.set(schemeName);
    this.saveColorSchemeToStorage(schemeName);
  }

  getColorSchemeDefinition(
    scheme: ColorScheme,
  ): ColorSchemeDefinition | undefined {
    return this.colorSchemes.find((s) => s.name === scheme);
  }

  getAllColorSchemes(): ColorSchemeDefinition[] {
    return this.colorSchemes;
  }

  // Method to create custom color schemes
  createCustomScheme(
    name: string,
    colors: ColorSchemeDefinition['colors'],
    description?: string,
  ): ColorSchemeDefinition {
    const customScheme: ColorSchemeDefinition = {
      name: name as ColorScheme,
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      description: description || 'Custom color scheme',
      colors,
    };

    this.colorSchemes.push(customScheme);
    return customScheme;
  }

  private loadColorSchemeFromStorage(): void {
    try {
      const savedScheme = localStorage.getItem(this.STORAGE_KEY);
      if (savedScheme && this.isValidColorScheme(savedScheme)) {
        this.currentScheme.set(savedScheme as ColorScheme);
      }
    } catch (error) {
      console.warn('Failed to load color scheme from localStorage:', error);
    }
  }

  private saveColorSchemeToStorage(schemeName: ColorScheme): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, schemeName);
    } catch (error) {
      console.warn('Failed to save color scheme to localStorage:', error);
    }
  }

  private isValidColorScheme(schemeName: string): boolean {
    return this.colorSchemes.some((scheme) => scheme.name === schemeName);
  }
}
