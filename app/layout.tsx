import './globals.css'

export const metadata = {
  title: 'MMAvex — Encyclopédie MMA',
  description: "Fiches de combattants, résultats et événements — MMAvex",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
}
