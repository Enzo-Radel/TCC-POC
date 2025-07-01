/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores customizadas do projeto
        'app': {
          'bg': '#1a1a1a',           // Background principal
          'card': '#333333',         // Background dos cards
          'card-hover': '#3a3a3a',   // Card hover state
          'input': '#2a2a2a',        // Background inputs
          'input-dark': '#252525',   // Background inputs escuro
        },
        'border': {
          'primary': '#4a4a4a',      // Border principal
          'hover': '#5a5a5a',        // Border hover
          'light': '#3a3a3a',        // Border mais claro
        },
        'text': {
          'primary': '#ffffff',       // Texto principal
          'secondary': '#e0e0e0',     // Texto secundário
          'muted': '#a0a0a0',        // Texto mais suave
          'placeholder': '#888888',   // Placeholder
        },
        'accent': {
          'gold': '#ffd700',         // Cor principal (ouro)
          'error': '#ff6b6b',        // Cor de erro
          'success': '#4ade80',      // Verde (aportes)
          'danger': '#f87171',       // Vermelho (retiradas)
          'info': '#60a5fa',         // Azul (saldo)
        }
      }
    },
  },
  plugins: [],
} 