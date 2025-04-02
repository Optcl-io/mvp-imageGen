// tailwind.config.js
module.exports = {
    theme: {
      extend: {
        fontFamily: {
          comic: ['"Comic Sans MS"', '"Comic Neue"', 'cursive'],
        },
        animation: {
          'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce-short': 'bounce 1s ease-in-out 3',
          'float': 'float 6s ease-in-out infinite',
          'float-delay': 'float 6s ease-in-out infinite 1s',
          'float-delay-2': 'float 6s ease-in-out infinite 2s',
          'wiggle': 'wiggle 1s ease-in-out infinite',
          'wiggle-delay': 'wiggle 1s ease-in-out infinite 0.3s',
          'wiggle-delay-2': 'wiggle 1s ease-in-out infinite 0.6s',
          'bounce-delay': 'bounce 1s ease-in-out infinite 0.2s',
          'bounce-delay-2': 'bounce 1s ease-in-out infinite 0.4s',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
          },
        },
      },
    },
  }