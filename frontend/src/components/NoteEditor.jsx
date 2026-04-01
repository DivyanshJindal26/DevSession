import { useState, useEffect } from 'react'

const TAGS = ['general', 'javascript', 'python', 'react', 'node']

export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tag, setTag] = useState('general')

  // Populate form when editing an existing note
  useEffect(() => {
    if (note) {
      setTitle(note.title || '')
      setContent(note.content || '')
      setTag(note.tag || 'general')
    } else {
      setTitle('')
      setContent('')
      setTag('general')
    }
  }, [note])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    onSave({ title: title.trim(), content: content.trim(), tag })
  }

  const isEditing = Boolean(note?._id)

  return (
    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5 max-w-2xl">
      <h2 className="text-zinc-600 text-xs uppercase tracking-widest">
        {isEditing ? 'Edit Note' : 'New Note'}
      </h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="bg-transparent border-b border-zinc-700 focus:border-indigo-500 outline-none text-zinc-100 text-xl font-medium py-2 transition-colors placeholder:text-zinc-700"
      />

      <select
        value={tag}
        onChange={e => setTag(e.target.value)}
        className="bg-zinc-800 border border-zinc-700 focus:border-indigo-500 text-zinc-300 text-sm rounded-md px-3 py-1.5 outline-none w-fit transition-colors"
      >
        {TAGS.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={14}
        className="bg-zinc-800 border border-zinc-700 focus:border-indigo-500 outline-none text-zinc-300 text-sm rounded-md p-4 resize-none transition-colors placeholder:text-zinc-700 leading-relaxed"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2 rounded-md transition-colors"
        >
          {isEditing ? 'Update' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-zinc-500 hover:text-zinc-300 text-sm px-5 py-2 rounded-md border border-zinc-700 hover:border-zinc-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
