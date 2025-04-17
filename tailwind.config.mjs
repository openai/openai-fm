const config = {
  // Enable class-based dark mode
  darkMode: 'class',
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // adjust paths as needed
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "custom-gray": "#E9E9E9",
      },
    },
  },
  plugins: [],
};

export default config;
