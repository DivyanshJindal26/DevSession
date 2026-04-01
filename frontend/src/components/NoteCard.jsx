// Tag colour map — purely visual
const TAG_COLORS = {
  javascript: 'bg-yellow-900 text-yellow-300',
  python: 'bg-blue-900 text-blue-300',
  react: 'bg-cyan-900 text-cyan-300',
  node: 'bg-green-900 text-green-300',
  general: 'bg-zinc-700 text-zinc-300',
}

export default function NoteCard({ note, isSelected, onClick, onDelete }) {
  const tagColor = TAG_COLORS[note.tag] || 'bg-zinc-700 text-zinc-300'

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-md cursor-pointer mb-1 border transition-colors ${
        isSelected
          ? 'bg-zinc-700 border-indigo-500'
          : 'bg-zinc-800 border-transparent hover:border-zinc-600'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-zinc-100 text-sm font-medium truncate">{note.title}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="text-zinc-600 hover:text-red-400 text-xs shrink-0 transition-colors mt-0.5"
          title="Delete note"
        >
          ✕
        </button>
      </div>

      <p className="text-zinc-500 text-xs mt-1 line-clamp-2 leading-relaxed">
        {note.content}
      </p>

      <div className="mt-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${tagColor}`}>
          {note.tag}
        </span>
      </div>
    </div>
  )
}
