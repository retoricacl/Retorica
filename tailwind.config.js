import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#AE8A60', // Dorado Tostado
        secondary: '#8A7968', // Marrón Latte
        accent: '#AE8A60',
        default: '#EAE0C8', // Crema
        muted: '#8A7968',
        gold: '#AE8A60',
        cream: '#EAE0C8',
        latte: '#8A7968',
        espresso: '#4A3F35',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        fade: 'fadeInUp 1s both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(2rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      // --- SECCIÓN AÑADIDA PARA LOS COLORES GLOBALES ---
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-headings': theme('colors.primary'), // Color para Títulos (Dorado)
            '--tw-prose-body': theme('colors.default'), // Color para Párrafos (Crema)
            '--tw-prose-lead': theme('colors.default'),
            '--tw-prose-links': theme('colors.primary'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.default'),
            '--tw-prose-bullets': theme('colors.default'),
            '--tw-prose-hr': theme('colors.primary / 0.4'),
            '--tw-prose-quotes': theme('colors.default'),
            '--tw-prose-quote-borders': theme('colors.primary / 0.4'),
            '--tw-prose-captions': theme('colors.default'),
            '--tw-prose-code': theme('colors.white'),
            '--tw-prose-pre-code': theme('colors.default'),
            '--tw-prose-pre-bg': 'rgb(30 41 59 / 50%)',
            '--tw-prose-th-borders': theme('colors.primary / 0.4'),
            '--tw-prose-td-borders': theme('colors.secondary / 0.4'),
          },
        },
      }),
      // --- FIN DE LA SECCIÓN AÑADIDA ---
    },
  },
  plugins: [
    typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant('intersect', '&:not([no-intersect])');
    }),
  ],
  darkMode: 'class',
};
