import { useState } from 'react'

// This toggle switches which backend the frontend talks to.
// Both backends expose the exact same API — this is purely for the demo.
export default function BackendToggle({ onChange }) {
  const [backend, setBackend] = useState(
    localStorage.getItem('devnotes_backend') || 'python'
  )

  const select = (value) => {
    setBackend(value)
    localStorage.setItem('devnotes_backend', value)
    onChange?.()
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-zinc-600 text-xs hidden md:block">backend:</span>
      <div className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-md p-1">
        <button
          onClick={() => select('python')}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            backend === 'python'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Python
        </button>
        <button
          onClick={() => select('node')}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            backend === 'node'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Node
        </button>
      </div>
    </div>
  )
}
