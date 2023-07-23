import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'NovelAI OpenSource',
  description: 'Write on your own.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
