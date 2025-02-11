module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'ut-burnt-orange': '#BF5700',
        'ut-grey': '#333F48',
      },
      fontFamily: {
        sans: ['RobotoFlex'],
      },
      keyframes: {
        'status-blink': {
          '0%, 60%, 100%': { opacity: 1 },
          '70%': { opacity: 0.7 },
        },
      },
      animation: {
        'status-blink': 'status-blink 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
