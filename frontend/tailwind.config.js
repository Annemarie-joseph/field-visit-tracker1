/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#EAE2D0',
        paperRaised: '#F3ECDD',
        ink: '#2B2118',
        inkSoft: '#6B5D4E',
        rule: '#C9BB9E',
        seal: '#1F6F63',
        gold: '#B8843A',
        flag: '#A64B3F',
      },
      fontFamily: {
        display: ['Cairo', 'sans-serif'],
        body: ['Cairo', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
