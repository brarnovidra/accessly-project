'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../../services/api'
import { authService } from '../../services/auth'

type ContentItem = {
  id: number,
  type: string,
  title: string,
  body: string,
  createdAt?: string
}

type Pagination = {
  currentPage: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPrevPage: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [contents, setContents] = useState<ContentItem[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [filter, setFilter] = useState<'all' | 'video' | 'article'>('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(6)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await api.get('/users/me')
        setUser(data.data)
      } catch { }
    }

    fetchUser()
    loadContents(1, filter, '') // initial load
  }, [])

  useEffect(() => {
    loadContents(1, filter, search, limit)
  }, [filter, search, limit])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearch(searchInput) 
    }, 500)

    return () => clearTimeout(delayDebounce) // clear on cleanup
  }, [searchInput])

  async function loadContents(
    page = 1,
    typeFilter: 'all' | 'video' | 'article' = 'all',
    keyword = '',
    pageSize = limit
  ) {
    setLoading(true)
    try {
      let url = `/contents/users?page=${page}&limit=${pageSize}`
      if (typeFilter !== 'all') {
        url += `&filterBy=type&filterValue=${typeFilter}`
      }
      if (keyword.trim() !== '') {
        url += `&search=${encodeURIComponent(keyword.trim())}`
      }

      const res = await api.get(url)
      if (res.status === 'success') {
        setContents(res.data.contents)
        setPagination(res.data.pagination)
      } else {
        throw new Error(res.message || 'Failed to load')
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (pagination.hasNextPage) {
      loadContents(pagination.currentPage + 1, filter, search)
    }
  }

  const handlePrev = () => {
    if (pagination.hasPrevPage) {
      loadContents(pagination.currentPage - 1, filter, search)
    }
  }

  const doLogout = async () => {
    await authService.logout()
    router.push('/auth/login')
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard</h1>
        <button
          onClick={doLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
        >
          Logout
        </button>
      </div>

      {user && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-gray-700">
          <p>Logged in as <strong>{user.email}</strong></p>
          <p>Membership: <strong>{user.memberships?.type || 'Unknown'}</strong></p>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter */}
        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">Filter Konten:</label>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as 'all' | 'video' | 'article')}
            className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 text-sm"
          >
            <option value="all">Semua</option>
            <option value="video">Video</option>
            <option value="article">Artikel</option>
          </select>
        </div>

        {/* Limit */}
        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">Jumlah per halaman:</label>
          <select
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            className="w-full sm:w-40 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 text-sm"
          >
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari konten..."
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 text-sm"
          />
        </div>

      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center text-gray-500">Loading content...</div>
      ) : (
        <>
          {contents.length === 0 ? (
            <div className="text-center text-gray-500">Tidak ada konten ditemukan.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contents.map(c => (
                <div
                  key={c.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${c.type === 'video' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'
                        }`}
                    >
                      {c.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{c.body}</p>
                  <p className="text-xs text-gray-400">📅 {formatDate(c.createdAt)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              disabled={!pagination.hasPrevPage}
              className={`px-4 py-2 rounded-md text-white ${pagination.hasPrevPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              ← Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={!pagination.hasNextPage}
              className={`px-4 py-2 rounded-md text-white ${pagination.hasNextPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
