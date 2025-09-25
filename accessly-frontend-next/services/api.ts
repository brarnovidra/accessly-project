'use client'

import Cookies from 'js-cookie'

export const api = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE || '',
  async request(path: string, opts: RequestInit = {}) {
    let accessToken = Cookies.get('accessToken') 
    const refreshToken = Cookies.get('refreshToken')

    opts.headers = opts.headers || {}

    if (accessToken) (opts.headers as any)['Authorization'] = 'Bearer ' + accessToken

    const res = await fetch(this.baseUrl + path, opts)

    if (res.status === 401 && refreshToken) {

      // try refresh
      const refreshed = await fetch(this.baseUrl + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (refreshed.ok) {
        const jr = await refreshed.json()

        accessToken = jr.data.accessToken

        // Update cookie
        (Cookies as typeof import('js-cookie')).set('accessToken', accessToken, { expires: 1, sameSite: 'Strict' })
        
        (opts.headers as any)['Authorization'] = 'Bearer ' + accessToken
        const retry = await fetch(this.baseUrl + path, opts)
        
        return await retry.json()
      } else {
        
        // refresh failed -> clear and redirect
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('user')

        window.location.href = '/auth/login'

        return { status: 'error', message: 'Session expired' }
      }
    }

    return await res.json()
  },
  get(path: string) {

    return this.request(path, { method: 'GET' })
  },
  post(path: string, body: any) {
    
    return this.request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  },
}
