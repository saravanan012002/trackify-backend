const escapeRegex = require("../utils/escapeRegex");
const Expense = require("../models/Expense");
const asyncHandler = require("../middleware/asyncHandler");

exports.createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create(req.body);
  const populated = await expense.populate("category");

  res.status(201).json({ success: true, data: populated });
});

exports.getExpenses = asyncHandler(async (req, res) => {
  const { from, to, category, search, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lt = new Date(to);
  }

  if (category) filter.category = category;
  if (search) filter.title = { $regex: escapeRegex(search), $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Expense.find(filter)
      .populate("category")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Expense.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

exports.getExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id).populate("category");

  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }

  res.json({ success: true, data: expense });
});

exports.updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate("category");

  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }

  res.json({ success: true, data: expense });
});

exports.deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);

  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }

  res.json({ success: true, message: "Expense deleted successfully" });
});