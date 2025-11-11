/**
 * Theme Tests
 */

import { theme } from '../../src/utils/theme';

describe('Theme', () => {
  describe('colors', () => {
    it('should have all required color properties', () => {
      expect(theme.colors.primary).toBeDefined();
      expect(theme.colors.primaryLight).toBeDefined();
      expect(theme.colors.secondary).toBeDefined();
      expect(theme.colors.background).toBeDefined();
      expect(theme.colors.surface).toBeDefined();
      expect(theme.colors.text).toBeDefined();
      expect(theme.colors.textSecondary).toBeDefined();
      expect(theme.colors.textOnPrimary).toBeDefined();
      expect(theme.colors.border).toBeDefined();
      expect(theme.colors.divider).toBeDefined();
      expect(theme.colors.error).toBeDefined();
      expect(theme.colors.errorLight).toBeDefined();
      expect(theme.colors.overlay).toBeDefined();
      expect(theme.colors.shadow).toBeDefined();
      expect(theme.colors.placeholder).toBeDefined();
    });

    it('should have valid color values', () => {
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbaRegex = /^rgba?\(/;

      Object.entries(theme.colors).forEach(([key, value]) => {
        if (key === 'overlay') {
          expect(value).toMatch(rgbaRegex);
        } else {
          expect(value).toMatch(colorRegex);
        }
      });
    });
  });

  describe('spacing', () => {
    it('should have all spacing values', () => {
      expect(theme.spacing.xs).toBe(4);
      expect(theme.spacing.sm).toBe(8);
      expect(theme.spacing.md).toBe(12);
      expect(theme.spacing.lg).toBe(16);
      expect(theme.spacing.xl).toBe(20);
      expect(theme.spacing.xxl).toBe(24);
      expect(theme.spacing.xxxl).toBe(32);
    });

    it('should have increasing spacing values', () => {
      expect(theme.spacing.xs).toBeLessThan(theme.spacing.sm);
      expect(theme.spacing.sm).toBeLessThan(theme.spacing.md);
      expect(theme.spacing.md).toBeLessThan(theme.spacing.lg);
      expect(theme.spacing.lg).toBeLessThan(theme.spacing.xl);
      expect(theme.spacing.xl).toBeLessThan(theme.spacing.xxl);
      expect(theme.spacing.xxl).toBeLessThan(theme.spacing.xxxl);
    });
  });

  describe('borderRadius', () => {
    it('should have all border radius values', () => {
      expect(theme.borderRadius.sm).toBe(6);
      expect(theme.borderRadius.md).toBe(8);
      expect(theme.borderRadius.lg).toBe(12);
      expect(theme.borderRadius.xl).toBe(20);
      expect(theme.borderRadius.round).toBe(9999);
    });
  });

  describe('fontSize', () => {
    it('should have all font size values', () => {
      expect(theme.fontSize.xs).toBe(12);
      expect(theme.fontSize.sm).toBe(14);
      expect(theme.fontSize.md).toBe(16);
      expect(theme.fontSize.lg).toBe(20);
      expect(theme.fontSize.xl).toBe(24);
    });

    it('should have increasing font sizes', () => {
      expect(theme.fontSize.xs).toBeLessThan(theme.fontSize.sm);
      expect(theme.fontSize.sm).toBeLessThan(theme.fontSize.md);
      expect(theme.fontSize.md).toBeLessThan(theme.fontSize.lg);
      expect(theme.fontSize.lg).toBeLessThan(theme.fontSize.xl);
    });
  });

  describe('fontWeight', () => {
    it('should have all font weight values', () => {
      expect(theme.fontWeight.regular).toBe('400');
      expect(theme.fontWeight.medium).toBe('500');
      expect(theme.fontWeight.semibold).toBe('600');
      expect(theme.fontWeight.bold).toBe('700');
    });
  });
});
