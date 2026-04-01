import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import NoteEditor from '../components/NoteEditor'
import api from '../api'

export default function Dashboard({ user }) {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const res = await api.get('/notes')
      setNotes(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleCreate = async (data) => {
    const res = await api.post('/notes', data)
    setNotes([res.data, ...notes])
    setIsCreating(false)
  }

  const handleUpdate = async (id, data) => {
    const res = await api.put(`/notes/${id}`, data)
    setNotes(notes.map(n => (n._id === id ? res.data : n)))
    setSelectedNote(null)
  }

  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`)
    setNotes(notes.filter(n => n._id !== id))
    if (selectedNote?._id === id) setSelectedNote(null)
  }

  const openEditor = isCreating || selectedNote !== null

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      <Navbar user={user} onBackendChange={fetchNotes} />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>

        {/* Left sidebar — notes list */}
        <aside className="w-72 border-r border-zinc-800 flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-500 text-xs uppercase tracking-widest">Notes</span>
            <button
              onClick={() => { setIsCreating(true); setSelectedNote(null) }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
            >
              + New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <p className="text-zinc-600 text-xs p-4">Loading...</p>
            ) : notes.length === 0 ? (
              <p className="text-zinc-600 text-xs p-4">No notes yet. Create one!</p>
            ) : (
              notes.map(note => (
                <NoteCard
                  key={note._id}
                  note={note}
                  isSelected={selectedNote?._id === note._id}
                  onClick={() => { setSelectedNote(note); setIsCreating(false) }}
                  onDelete={() => handleDelete(note._id)}
                />
              ))
            )}
          </div>
        </aside>

        {/* Right panel — editor or empty state */}
        <main className="flex-1 overflow-y-auto">
          {openEditor ? (
            <NoteEditor
              note={selectedNote}
              onSave={selectedNote
                ? (data) => handleUpdate(selectedNote._id, data)
                : handleCreate
              }
              onCancel={() => { setIsCreating(false); setSelectedNote(null) }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-700 text-sm">Select a note or create a new one</p>
            </div>
          )}
        </main>

      </div>
    </div>
  )
}
