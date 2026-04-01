import { logOut } from '../firebase'
import BackendToggle from './BackendToggle'

export default function Navbar({ user, onBackendChange }) {
  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-6 flex items-center justify-between shrink-0">
      <span className="text-zinc-100 font-bold tracking-tight">DevNotes</span>

      <div className="flex items-center gap-4">
        <BackendToggle onChange={onBackendChange} />

        <div className="flex items-center gap-3">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="avatar"
              className="w-7 h-7 rounded-full border border-zinc-700"
            />
          )}
          <span className="text-zinc-400 text-xs hidden sm:block">{user.displayName}</span>
          <button
            onClick={logOut}
            className="text-zinc-500 hover:text-zinc-200 text-xs border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-md transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
