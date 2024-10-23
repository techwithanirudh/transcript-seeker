import type { Config } from 'tailwindcss';

// import { fontFamily } from "tailwindcss/defaultTheme";

import baseConfig from '@meeting-baas/tailwind-config/web';

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, '../../packages/ui/src/*.{ts,tsx}'],
  presets: [baseConfig],
  theme: {
    extend: {
      fontSize: {
        'base': '1.5rem',    // 24px
        'lg': '1.75rem',     // 28px
        'xl': '2rem',        // 32px
        '2xl': '2.5rem',     // 40px
        '3xl': '3rem',       // 48px
        '4xl': '3.75rem',    // 60px
      },
      lineHeight: {
        'normal': '1.6',    // Increase line height for better readability
      },
      spacing: {
        '1': '0.5rem',
        '2': '1rem',
        '3': '1.5rem',
        '4': '2rem',
        // ... and so on
      },
    },
  },
} satisfies Config;
