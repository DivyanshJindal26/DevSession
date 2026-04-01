import axios from 'axios'
import { auth } from './firebase'

// Both backends expose the same endpoints — only the port differs
const BACKEND_URLS = {
  python: import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8096',
  node: import.meta.env.VITE_NODE_API_URL || 'http://localhost:8097',
}

// Read which backend to use from localStorage (set by BackendToggle)
const getBaseURL = () => {
  const backend = localStorage.getItem('devnotes_backend') || 'python'
  return BACKEND_URLS[backend]
}

const api = axios.create()

// Before every request:
// 1. Set the base URL from the toggle
// 2. Attach the Firebase ID token as a Bearer token
api.interceptors.request.use(async (config) => {
  config.baseURL = getBaseURL()

  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
