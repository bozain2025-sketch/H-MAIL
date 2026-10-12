/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ui: {
          bg: 'var(--ui-bg)',
          sidebar: 'var(--ui-sidebar)',
          panel: 'var(--ui-panel)',
          fg: 'var(--ui-fg)',
          'fg-muted': 'var(--ui-fg-muted)',
          border: 'var(--ui-border)',
          accent: 'var(--ui-accent)',
          'fg-on-accent': 'var(--ui-fg-on-accent)',
          'accent-soft': 'var(--ui-accent-soft)',
          danger: 'var(--ui-danger)',
          focus: 'var(--ui-focus)',
        },
      },
      borderRadius: {
        mac: 'var(--ui-radius)',
      },
      fontFamily: {
        mac: 'var(--ui-font)',
      },
      boxShadow: {
        'mac-window': '0 20px 40px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)',
        'mac-modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
