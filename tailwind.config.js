/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         'wrap-in': {
//           '0%': { opacity: '0', transform: 'scale(0.95)' },
//           '100%': { opacity: '1', transform: 'scale(1)' },
//         },
//         'wrap-out': {
//           '0%': { opacity: '1', transform: 'scale(1)' },
//           '100%': { opacity: '0', transform: 'scale(0.95)' },
//         },
//       },
//       animation: {
//         'wrap-in': 'wrap-in 0.3s ease-in-out',
//         'wrap-out': 'wrap-out 0.3s ease-in-out',
//       },
//     },
//   },
//   plugins: [],
// };


