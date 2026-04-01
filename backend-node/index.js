require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./db')
const { verifyToken } = require('./auth')
const Note = require('./noteModel')

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8095').split(',')
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

connectDB()

// --------------------------------------------------------------------------- //
// Health check — no auth required                                              //
// --------------------------------------------------------------------------- //
app.get('/health', (req, res) => {
  res.json({ status: 'ok', backend: 'node' })
})

// --------------------------------------------------------------------------- //
// GET /notes — return all notes belonging to the logged-in user                //
// --------------------------------------------------------------------------- //
app.get('/notes', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ uid: req.uid }).sort({ created_at: -1 })
    res.json(notes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// --------------------------------------------------------------------------- //
// POST /notes — create a new note                                              //
// --------------------------------------------------------------------------- //
app.post('/notes', verifyToken, async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, uid: req.uid })
    res.status(201).json(note)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// --------------------------------------------------------------------------- //
// PUT /notes/:id — update a note (only if it belongs to the user)             //
// --------------------------------------------------------------------------- //
app.put('/notes/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, uid: req.uid },
      { ...req.body, updated_at: new Date() },
      { new: true }
    )
    if (!note) return res.status(404).json({ error: 'Note not found' })
    res.json(note)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// --------------------------------------------------------------------------- //
// DELETE /notes/:id — delete a note (only if it belongs to the user)          //
// --------------------------------------------------------------------------- //
app.delete('/notes/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({ _id: req.params.id, uid: req.uid })
    if (!deleted) return res.status(404).json({ error: 'Note not found' })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Node backend running on http://localhost:${PORT}`)
})
