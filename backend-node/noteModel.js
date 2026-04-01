const mongoose = require('mongoose')

// Mongoose schema — equivalent to the Pydantic models in the Python backend
const noteSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true }, // Firebase user UID
  title: { type: String, required: true },
  content: { type: String, required: true },
  tag: { type: String, default: 'general' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Note', noteSchema)
