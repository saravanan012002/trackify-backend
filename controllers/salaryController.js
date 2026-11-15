const Salary = require("../models/Salary");
const asyncHandler = require("../middleware/asyncHandler");

exports.createSalary = asyncHandler(async (req, res) => {
  const salary = await Salary.create(req.body);
  res.status(201).json({ success: true, data: salary });
});

exports.getSalaries = asyncHandler(async (req, res) => {
  const salaries = await Salary.find().sort({ year: -1, month: -1 });
  res.json({ success: true, data: salaries });
});

exports.getSalary = asyncHandler(async (req, res) => {
  const salary = await Salary.findById(req.params.id);

  if (!salary) {
    return res.status(404).json({ success: false, message: "Salary not found" });
  }

  res.json({ success: true, data: salary });
});

exports.updateSalary = asyncHandler(async (req, res) => {
  const salary = await Salary.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!salary) {
    return res.status(404).json({ success: false, message: "Salary not found" });
  }

  res.json({ success: true, data: salary });
});

exports.deleteSalary = asyncHandler(async (req, res) => {
  const salary = await Salary.findByIdAndDelete(req.params.id);

  if (!salary) {
    return res.status(404).json({ success: false, message: "Salary not found" });
  }

  res.json({ success: true, message: "Salary deleted successfully" });
});