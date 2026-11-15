const Reminder = require("../models/Reminder");
const asyncHandler = require("../middleware/asyncHandler");

exports.createReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.create(req.body);
  res.status(201).json({ success: true, data: reminder });
});

exports.getReminders = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.completed !== undefined) {
    filter.completed = req.query.completed === "true";
  }

  if (req.query.from || req.query.to) {
    filter.dateTime = {};
    if (req.query.from) filter.dateTime.$gte = new Date(req.query.from);
    if (req.query.to) filter.dateTime.$lt = new Date(req.query.to);
  }

  const reminders = await Reminder.find(filter).sort({ dateTime: 1 });
  res.json({ success: true, data: reminders });
});

exports.getReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    return res.status(404).json({ success: false, message: "Reminder not found" });
  }

  res.json({ success: true, data: reminder });
});

exports.updateReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!reminder) {
    return res.status(404).json({ success: false, message: "Reminder not found" });
  }

  res.json({ success: true, data: reminder });
});

exports.deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findByIdAndDelete(req.params.id);

  if (!reminder) {
    return res.status(404).json({ success: false, message: "Reminder not found" });
  }

  res.json({ success: true, message: "Reminder deleted successfully" });
});