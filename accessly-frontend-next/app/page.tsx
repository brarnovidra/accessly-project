'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Membership Frontend (Next.js + Tailwind)</h1>
      <div className="space-x-2">
        <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
        <Link href="/auth/register" className="px-4 py-2 bg-green-600 text-white rounded">Register</Link>
        <Link href="/dashboard" className="px-4 py-2 bg-gray-600 text-white rounded">Dashboard</Link>
      </div>
    </div>
  )
}
