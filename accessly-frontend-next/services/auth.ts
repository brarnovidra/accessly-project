'use client'

import Cookies from 'js-cookie'

export const authService = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE || '',

  async login(email: string, password: string) {
    const res = await fetch(this.baseUrl + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const json = await res.json()
    if (json.status !== 'success') throw new Error(json.message || 'Login failed')

    // Simpan ke cookie
    Cookies.set('accessToken', json.data.accessToken, { expires: 1, sameSite: 'Strict' })
    Cookies.set('refreshToken', json.data.refreshToken, { expires: 7, sameSite: 'Strict' })
    Cookies.set('user', JSON.stringify(json.data.user), { expires: 1, sameSite: 'Strict' })
    
    return json
  },

  async register(email: string, password: string, membership_id: number) {
    const res = await fetch(this.baseUrl + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, membership_id }),
    })

    const json = await res.json()
    if (json.status !== 'success') throw new Error(json.message || 'Register failed')
    
    return json
  },

  async logout() {
    const refreshToken = Cookies.get('refreshToken') || localStorage.getItem('refreshToken')
    if (!refreshToken) {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      Cookies.remove('user')

      return
    }

    await fetch(this.baseUrl + '/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('user')
  },
}
