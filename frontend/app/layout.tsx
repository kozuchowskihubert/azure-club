import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ARCH1TECT - DJ Booking',
  description: 'Professional DJ booking system for ARCH1TECT events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  )
}
