import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    fontFamily: {
      fontFamily: {
        sans: ['\'Nerko One\'', '\'Nerko One fallback\'', ...defaultTheme.fontFamily.sans],
      }
    }
  }
}
