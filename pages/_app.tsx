import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import 'styles/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute='class'
      disableTransitionOnChange
      forcedTheme='dark'
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
