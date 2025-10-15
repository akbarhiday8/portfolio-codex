/**
 * @file PostCSS Configuration
 * @description Konfigurasi PostCSS untuk memproses CSS dengan Tailwind dan Autoprefixer
 */

import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path'

export default {
  plugins: [
    tailwindcss({
      config: path.resolve(__dirname, 'tailwind.config.js')
    }),
    autoprefixer,
  ],
} 