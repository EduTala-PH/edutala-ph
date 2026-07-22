import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.resetModules()
})

afterEach(() => {
  delete globalThis.fetch
})

describe('setAccessToken / getAccessToken', () => {
  it('returns null initially', async () => {
    const { getAccessToken } = await import('./api')
    expect(getAccessToken()).toBeNull()
  })

  it('stores and retrieves a token', async () => {
    const { setAccessToken, getAccessToken } = await import('./api')
    setAccessToken('my-token')
    expect(getAccessToken()).toBe('my-token')
  })

  it('overwrites existing token', async () => {
    const { setAccessToken, getAccessToken } = await import('./api')
    setAccessToken('token-1')
    setAccessToken('token-2')
    expect(getAccessToken()).toBe('token-2')
  })
})

describe('api.get', () => {
  it('makes a GET request and returns parsed response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true, data: { id: 1 } }),
    })
    const { api } = await import('./api')
    const res = await api.get('/test')
    expect(res).toEqual({ status: 200, success: true, data: { id: 1 } })
  })

  it('includes Authorization header when token is set', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
    const { api, setAccessToken } = await import('./api')
    setAccessToken('bearer-token')
    await api.get('/secure')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/secure'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer bearer-token' }),
      }),
    )
  })

  it('does not include Authorization header when no token is set', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
    const { api } = await import('./api')
    await api.get('/public')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/public'),
      expect.objectContaining({
        headers: {},
      }),
    )
  })
})

describe('api.post', () => {
  it('makes a POST request with JSON body', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
    const { api } = await import('./api')
    const body = { email: 'a@b.com', password: 'secret' }
    await api.post('/login', body)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/login'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
      }),
    )
  })

  it('makes a POST request without body', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
    const { api } = await import('./api')
    await api.post('/logout')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/logout'),
      expect.objectContaining({ method: 'POST', body: undefined }),
    )
  })
})

describe('api.patch', () => {
  it('makes a PATCH request with body', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
    const { api } = await import('./api')
    await api.patch('/update', { name: 'new-name' })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/update'),
      expect.objectContaining({ method: 'PATCH' }),
    )
  })
})

describe('api.delete', () => {
  it('makes a DELETE request', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
    const { api } = await import('./api')
    await api.delete('/resource/1')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/resource/1'),
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})

describe('401 retry with refresh token', () => {
  it('retries with new token when refresh succeeds', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        status: 401,
        json: () => Promise.resolve({ success: false }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { access_token: 'refreshed' } }),
      })
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ success: true, data: 'retried-ok' }),
      })
    const { api, setAccessToken } = await import('./api')
    setAccessToken('expired')
    const res = await api.get('/data')
    expect(fetch).toHaveBeenCalledTimes(3)
    expect(res.success).toBe(true)
    expect(res.data).toBe('retried-ok')
  })

  it('does not retry when refresh fails', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        status: 401,
        json: () => Promise.resolve({ success: false }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}),
      })
    const { api, setAccessToken } = await import('./api')
    setAccessToken('expired')
    const res = await api.get('/data')
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(res.status).toBe(401)
  })

  it('does not attempt refresh on 401 when no token is set', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 401,
      json: () => Promise.resolve({ success: false }),
    })
    const { api } = await import('./api')
    await api.get('/data')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('handles refresh that returns success: false', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        status: 401,
        json: () => Promise.resolve({ success: false }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      })
    const { api, setAccessToken } = await import('./api')
    setAccessToken('expired')
    await api.get('/data')
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
