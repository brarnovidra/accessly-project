import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Accessly Frontend',
  description: 'Frontend for Accessly app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
