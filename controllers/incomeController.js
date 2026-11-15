const escapeRegex = require("../utils/escapeRegex");
const Income = require("../models/Income");
const asyncHandler = require("../middleware/asyncHandler");

exports.createIncome = asyncHandler(async (req, res) => {
  const income = await Income.create(req.body);
  const populated = await income.populate("category");

  res.status(201).json({ success: true, data: populated });
});

exports.getIncomes = asyncHandler(async (req, res) => {
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
    Income.find(filter)
      .populate("category")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Income.countDocuments(filter)
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

exports.getIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id).populate("category");

  if (!income) {
    return res.status(404).json({ success: false, message: "Income not found" });
  }

  res.json({ success: true, data: income });
});

exports.updateIncome = asyncHandler(async (req, res) => {
  const income = await Income.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate("category");

  if (!income) {
    return res.status(404).json({ success: false, message: "Income not found" });
  }

  res.json({ success: true, data: income });
});

exports.deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findByIdAndDelete(req.params.id);

  if (!income) {
    return res.status(404).json({ success: false, message: "Income not found" });
  }

  res.json({ success: true, message: "Income deleted successfully" });
});