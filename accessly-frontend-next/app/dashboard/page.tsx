'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../../services/api'
import { authService } from '../../services/auth'

type ContentItem = { id: number, type: string, title: string, body: string }

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await api.get('/user/me')
        setUser(data.data)
      } catch {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
    loadContents()
  }, [])

  async function loadContents() {
    setLoading(true)
    try {
      const res = await api.get('/content')
      if (res.status === 'success') {
        const contents = res.data.contents;
        setContents(contents)
        console.log(contents)
      } else {
        throw new Error(res.message || 'Failed to load')
      }
    } catch (err: any) {
      // if refresh failed, authService will redirect to login
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const doLogout = async () => {
    await authService.logout()
    router.push('/auth/login')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div>
          <button onClick={doLogout} className="px-3 py-2 bg-red-600 text-white rounded">Logout</button>
        </div>
      </div>

      {user && <div className="mb-4 p-4 bg-blue-50 rounded">Logged in as <strong>{user.email}</strong> — Membership: <strong>{user.membership?.type}</strong></div>}

      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {contents.map(c => (
            <div key={c.id} className="p-4 bg-white rounded shadow">
              <h3 className="font-semibold">{c.title} <span className="text-sm text-gray-500">({c.type})</span></h3>
              <p className="text-gray-700">{c.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
