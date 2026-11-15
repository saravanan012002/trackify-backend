const escapeRegex = require("../utils/escapeRegex");
const Note = require("../models/Note");
const asyncHandler = require("../middleware/asyncHandler");

exports.createNote = asyncHandler(async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json({ success: true, data: note });
});

exports.getNotes = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.search) {
    filter.$or = [
      { title: { $regex: escapeRegex(req.query.search), $options: "i" } },
      { content: { $regex: escapeRegex(req.query.search), $options: "i" } }
    ];
  }

  if (req.query.pinned !== undefined) {
    filter.pinned = req.query.pinned === "true";
  }

  const notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
  res.json({ success: true, data: notes });
});

exports.getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }

  res.json({ success: true, data: note });
});

exports.updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!note) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }

  res.json({ success: true, data: note });
});

exports.deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);

  if (!note) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }

  res.json({ success: true, message: "Note deleted successfully" });
});