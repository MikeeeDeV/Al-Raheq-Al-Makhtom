/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        m3: {
          primary: {
            DEFAULT: '#0D6E4F',
            light: '#0D6E4F',
            dark: '#7ADAAD',
            container: '#A7F3D0',
            containerDark: '#00523C',
            onContainer: '#002116',
            onContainerDark: '#A7F3D0',
          },
          secondary: {
            DEFAULT: '#B48A34',
            light: '#B48A34',
            dark: '#EAC275',
            container: '#FDE8B5',
            containerDark: '#563F00',
            onContainer: '#2B1D00',
            onContainerDark: '#FDE8B5',
          },
          tertiary: {
            DEFAULT: '#1E6573',
            container: '#C3E8F0',
            onContainer: '#001F25',
          },
          surface: {
            DEFAULT: '#F8FAF8',
            dim: '#F0F4F1',
            container: '#E8EFEA',
            high: '#E2EAE4',
            highest: '#DCDEE0',
            variant: '#DEE5DF',
            dark: '#101412',
            darkDim: '#141816',
            darkContainer: '#1C211E',
            darkHigh: '#262C29',
          },
          onSurface: {
            DEFAULT: '#191C1A',
            variant: '#404944',
            dark: '#E1E3E0',
            darkVariant: '#C0C9C2',
          },
          outline: {
            DEFAULT: '#707974',
            variant: '#C1C8C3',
            dark: '#89938D',
            darkVariant: '#404944',
          },
          error: {
            DEFAULT: '#BA1A1A',
            container: '#FFDAD6',
            onContainer: '#410002',
          },
          success: {
            DEFAULT: '#15803D',
            container: '#DCFCE7',
            onContainer: '#052E16',
          }
        }
      },
      fontFamily: {
        arabic: ['Readex Pro', 'Cairo', 'Noto Sans Arabic', 'sans-serif'],
      },
      boxShadow: {
        'm3-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
        'm3-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.30)',
        'm3-5': '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.30)',
      },
      borderRadius: {
        'm3-xs': '4px',
        'm3-s': '8px',
        'm3-m': '12px',
        'm3-l': '16px',
        'm3-xl': '28px',
        'm3-full': '9999px',
      },
      transitionTimingFunction: {
        'm3-standard': 'cubic-bezier(0.2, 0.0, 0, 1.0)',
        'm3-decelerate': 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
        'm3-accelerate': 'cubic-bezier(0.4, 0.0, 1, 1.0)',
      }
    },
  },
  plugins: [],
}
