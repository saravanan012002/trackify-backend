const Category = require("../models/Category");
const asyncHandler = require("../middleware/asyncHandler");

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = { $in: [req.query.type, "both"] };

  const categories = await Category.find(filter).sort({ name: 1 });
  res.json({ success: true, data: categories });
});

exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  res.json({ success: true, data: category });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  res.json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  res.json({ success: true, message: "Category deleted successfully" });
});

exports.seedCategories = asyncHandler(async (req, res) => {
  const defaults = [
    { name: "Food", type: "expense", icon: "restaurant", color: "#FF6B6B" },
    { name: "Transport", type: "expense", icon: "directions_car", color: "#4D96FF" },
    { name: "Shopping", type: "expense", icon: "shopping_bag", color: "#9B5DE5" },
    { name: "Bills", type: "expense", icon: "receipt_long", color: "#F9C74F" },
    { name: "Health", type: "expense", icon: "favorite", color: "#F94144" },
    { name: "Education", type: "expense", icon: "school", color: "#43AA8B" },
    { name: "Entertainment", type: "expense", icon: "movie", color: "#7B61FF" },
    { name: "Others", type: "both", icon: "more_horiz", color: "#577590" },
    { name: "Salary", type: "income", icon: "payments", color: "#2FBF71" },
    { name: "Freelance", type: "income", icon: "work", color: "#00B4D8" },
    { name: "Business", type: "income", icon: "business", color: "#90BE6D" },
    { name: "Gift", type: "income", icon: "card_giftcard", color: "#F9844A" },
    { name: "Investment", type: "income", icon: "trending_up", color: "#277DA1" }
  ];

  const created = [];

  for (const item of defaults) {
    const exists = await Category.findOne({ name: item.name, type: item.type });
    if (!exists) created.push(await Category.create(item));
  }

  res.status(201).json({
    success: true,
    message: `${created.length} default categories created`,
    data: created
  });
});