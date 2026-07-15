export const getToken = () => localStorage.getItem('token')
export const getUser = () => JSON.parse(localStorage.getItem('user') || 'null')
export const isLoggedIn = () => !!localStorage.getItem('token')
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}