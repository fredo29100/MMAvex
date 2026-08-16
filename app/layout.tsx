import './globals.css'
import { Inter, Oswald } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300','400','600','700'] })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', weight: ['400','600','700'] })

export const metadata = {
  title: 'MMAvex — Encyclopédie MMA',
  description: "Fiches de combattants, résultats et événements — MMAvex",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${oswald.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
