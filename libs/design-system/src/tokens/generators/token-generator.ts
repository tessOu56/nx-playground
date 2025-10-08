import { createGlobalTheme } from '@vanilla-extract/css';

export interface RawTokenData {
  colors: {
    base: Record<string, string>;
    gray: Record<string, string>;
    brand: Record<string, string>;
    error: Record<string, string>;
    warning: Record<string, string>;
    success: Record<string, string>;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontWeight: Record<string, string>;
    fontSize: Record<string, string>;
    lineHeight: Record<string, string>;
  };
}

export class TokenGenerator {
  private _rawData: RawTokenData;

  constructor(rawData: RawTokenData) {
    this._rawData = rawData;
  }

  generateTheme(selector = ':root') {
    return createGlobalTheme(selector, {
      colors: {
        base: this._rawData.colors.base,
        gray: this._rawData.colors.gray,
        brand: this._rawData.colors.brand,
        error: this._rawData.colors.error,
        warning: this._rawData.colors.warning,
        success: this._rawData.colors.success,
      },
      spacing: this._rawData.spacing,
      radius: this._rawData.radius,
      fontFamily: this._rawData.typography.fontFamily,
      fontWeight: this._rawData.typography.fontWeight,
      fontSize: this._rawData.typography.fontSize,
      lineHeight: this._rawData.typography.lineHeight,
    });
  }

  generateSemanticTheme(selector = ':root') {
    const baseTheme = this.generateTheme(selector);

    return {
      ...baseTheme,
      semantic: {
        text: {
          primary: this._rawData.colors.gray['900'],
          secondary: this._rawData.colors.gray['700'],
          tertiary: this._rawData.colors.gray['600'],
          disabled: this._rawData.colors.gray['500'],
          inverse: this._rawData.colors.base.white,
          error: this._rawData.colors.error['600'],
          warning: this._rawData.colors.warning['600'],
          success: this._rawData.colors.success['600'],
          brand: this._rawData.colors.brand['600'],
        },
        background: {
          primary: this._rawData.colors.base.white,
          secondary: this._rawData.colors.gray['50'],
          tertiary: this._rawData.colors.gray['100'],
          disabled: this._rawData.colors.gray['100'],
          brand: this._rawData.colors.brand['50'],
          error: this._rawData.colors.error['50'],
          warning: this._rawData.colors.warning['50'],
          success: this._rawData.colors.success['50'],
        },
        border: {
          primary: this._rawData.colors.gray['300'],
          secondary: this._rawData.colors.gray['200'],
          disabled: this._rawData.colors.gray['300'],
          error: this._rawData.colors.error['500'],
          brand: this._rawData.colors.brand['500'],
        },
      },
    };
  }

  generateResponsiveTheme(selector = ':root') {
    const baseTheme = this.generateTheme(selector);

    return {
      ...baseTheme,
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      container: {
        maxWidth: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
        padding: {
          mobile: this._rawData.spacing['4'],
          desktop: this._rawData.spacing['8'],
        },
      },
    };
  }

  generateFullTheme(selector = ':root') {
    const semanticTheme = this.generateSemanticTheme(selector);
    const responsiveTheme = this.generateResponsiveTheme(selector);

    return {
      ...semanticTheme,
      ...responsiveTheme,
      shadows: {
        xs: `0 1px 2px 0 ${this._rawData.colors.base.black}05`,
        sm: `0 1px 3px 0 ${this._rawData.colors.base.black}10, 0 1px 2px 0 ${this._rawData.colors.base.black}06`,
        md: `0 4px 6px -1px ${this._rawData.colors.base.black}10, 0 2px 4px -1px ${this._rawData.colors.base.black}06`,
        lg: `0 10px 15px -3px ${this._rawData.colors.base.black}10, 0 4px 6px -2px ${this._rawData.colors.base.black}05`,
        xl: `0 20px 25px -5px ${this._rawData.colors.base.black}10, 0 10px 10px -5px ${this._rawData.colors.base.black}04`,
        '2xl': `0 25px 50px -12px ${this._rawData.colors.base.black}25`,
      },
      animations: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
        },
        easing: {
          linear: 'linear',
          ease: 'ease',
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out',
        },
      },
    };
  }
}

export function createThemeFromRawData(
  rawData: RawTokenData,
  selector?: string
) {
  const generator = new TokenGenerator(rawData);
  return generator.generateFullTheme(selector);
}

export function createSemanticThemeFromRawData(
  rawData: RawTokenData,
  selector?: string
) {
  const generator = new TokenGenerator(rawData);
  return generator.generateSemanticTheme(selector);
}
