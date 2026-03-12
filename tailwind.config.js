/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'var(--font-sans)', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['2.25rem', { lineHeight: '1.15', fontWeight: '500' }],
        'hero-lg': ['2.5rem', { lineHeight: '1.1', fontWeight: '500' }],
        'card-title': ['1.125rem', { lineHeight: '1.3', fontWeight: '500' }],
        'metric-lg': ['2.5rem', { lineHeight: '1', fontWeight: '500' }],
        'metric-md': ['1.625rem', { lineHeight: '1', fontWeight: '500' }],
        'body': ['0.9375rem', { lineHeight: '1.5' }],
        'label': ['0.8125rem', { lineHeight: '1.4' }],
      },
      colors: {
        primary: {
          50:  '#FBF8EF',
          100: '#F4EDD2',
          200: '#E9DAAA',
          300: '#D9C07F',
          400: '#C8A85E',   /* restrained brass — used for chips, bar accents */
          500: '#B5913F',   /* mid gold — active states */
          600: '#9A7730',
          700: '#7A5E25',
          800: '#5C471C',
          900: '#453618',
        },
        secondary: {
          50: '#F5F5F4',
          100: '#E8E6E4',
          200: '#D5D2CF',
          300: '#B2ADAA',
          400: '#878279',
          500: '#605B56',
          600: '#4A4440',
          700: '#4B4541',
          800: '#3E3935',
          900: '#322D2A',
          950: '#262220',
        },
        gray: {
          25:  '#FDFCFA',
          50:  '#F6F4F0',
          100: '#EDEAD4',   /* keep warm but lighter */
          150: '#E4E0D6',
          200: '#D9D4CA',
          300: '#C4BDB2',
          400: '#A89F94',
          500: '#89827A',
          600: '#6B6560',
          700: '#4D4A46',
          800: '#33312E',
          900: '#1C1A18',
          page: '#E8E4DD',   /* soft warm linen — calm, not intrusive */
        },
        success: { light: '#E4F5EC', DEFAULT: '#4CAF75', dark: '#2D7A50' },
        warning: { light: '#FBF2DC', DEFAULT: '#C9A03A', dark: '#987528' },
        danger:  { light: '#FCEAEA', DEFAULT: '#D96262', dark: '#A84040' },
        info:    { light: '#E3EEF9', DEFAULT: '#5A96CC', dark: '#3268A0' },
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        pill: 'var(--radius-pill)',
      },
      spacing: {
        micro: 'var(--space-micro)',
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        shell: 'var(--space-shell)',
      },
      boxShadow: {
        shell: '0 16px 48px rgba(30, 24, 16, 0.07)',
        'card-soft': '0 4px 16px rgba(30, 24, 16, 0.05)',
        'card-dark': '0 8px 28px rgba(0, 0, 0, 0.18)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '220ms',
        slow: '320ms',
      },
      maxWidth: {
        shell: 'var(--max-width-shell)',
      },
    },
  },
  plugins: [],
};
