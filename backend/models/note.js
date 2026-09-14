const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tag: { type: String, default: "General" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pinned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);