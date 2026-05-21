/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['SF Pro Text', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        apple: {
          primary: '#0066cc',
          'primary-focus': '#0071e3',
          'primary-on-dark': '#2997ff',
          canvas: '#ffffff',
          parchment: '#f5f5f7',
          'surface-pearl': '#fafafc',
          'surface-tile-1': '#272729',
          'surface-tile-2': '#2a2a2c',
          'surface-tile-3': '#252527',
          'surface-black': '#000000',
          'surface-chip': 'rgba(210, 210, 215, 0.64)',
          ink: '#1d1d1f',
          'ink-muted': '#333333',
          'ink-faint': '#7a7a7a',
          'body-on-dark': '#ffffff',
          'body-muted': '#cccccc',
          divider: '#f0f0f0',
          hairline: '#e0e0e0',
        },
      },
      borderRadius: {
        'apple-sm': '8px',
        'apple-md': '11px',
        'apple-lg': '18px',
        'apple-pill': '9999px',
      },
      boxShadow: {
        'apple-product': '3px 5px 30px 0 rgba(0, 0, 0, 0.22)',
        'apple-hairline': '0 0 0 1px rgba(0, 0, 0, 0.08)',
        'apple-hairline-dark': '0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      spacing: {
        'apple-section': '80px',
      },
      letterSpacing: {
        'apple-tight': '-0.374px',
        'apple-tighter': '-0.224px',
        'apple-loose': '0.231px',
      },
      backdropBlur: {
        xs: '2px',
        apple: '20px',
      },
    },
  },
  plugins: [],
};
