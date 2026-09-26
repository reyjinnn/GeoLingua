const KEY = 'geolingua_session_token'

export const tokenStorage = {
  get: () => window.localStorage.getItem(KEY),
  set: (token: string) => window.localStorage.setItem(KEY, token),
  clear: () => window.localStorage.removeItem(KEY),
}
