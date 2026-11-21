const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Salary = require("../models/Salary");
const asyncHandler = require("../middleware/asyncHandler");
const {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear
} = require("../utils/dateUtils");

const totals = async (Model, start, end) => {
  const result = await Model.aggregate([
    { $match: { date: { $gte: start, $lt: end } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  return result[0]?.total || 0;
};

exports.getMonthlyReport = asyncHandler(async (req, res) => {
  const year = Number(req.query.year);
  const month = Number(req.query.month);

  if (!year || !month || month < 1 || month > 12) {
    return res.status(400).json({
      success: false,
      message: "year and month are required"
    });
  }

  const start = startOfMonth(year, month);
  const end = endOfMonth(year, month);

  const [income, expenses, salary, categoryBreakdown, dailyExpenses] =
    await Promise.all([
      totals(Income, start, end),
      totals(Expense, start, end),
      Salary.findOne({ year, month }),
      Expense.aggregate([
        { $match: { date: { $gte: start, $lt: end } } },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" }
          }
        },
        { $sort: { total: -1 } },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category"
          }
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            categoryId: "$_id",
            category: "$category.name",
            color: "$category.color",
            total: 1
          }
        }
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: start, $lt: end } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" }
            },
            total: { $sum: "$amount" }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

      // Calculate cumulative totals up to the selected month
  const [allIncome, allExpenses, allSalaries] = await Promise.all([
    totals(Income, new Date(0), end),
    totals(Expense, new Date(0), end),
    Salary.find({
      $or: [
        { year: { $lt: year } },
        { year, month: { $lte: month } }
      ]
    })
  ]);

  // Calculate total salary credited so far
  const cumulativeSalary = allSalaries.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  // Running balance across all months
  const cumulativeBalance =
    cumulativeSalary + allIncome - allExpenses;

  res.json({
    success: true,
    data: {
      period: { year, month },
      income,
      salary: salary?.amount || 0,
      expenses,
      balance: income - expenses,
      cumulativeBalance,
      savingsRate: income > 0 ? Number((((income - expenses) / income) * 100).toFixed(2)) : 0,
      categoryBreakdown,
      dailyExpenses
    }
  });
});

exports.getYearlyReport = asyncHandler(async (req, res) => {
  const year = Number(req.query.year);

  if (!year) {
    return res.status(400).json({
      success: false,
      message: "year is required"
    });
  }

  const start = startOfYear(year);
  const end = endOfYear(year);

  const [income, expenses, salaries, monthly] = await Promise.all([
    totals(Income, start, end),
    totals(Expense, start, end),
    Salary.find({ year }).sort({ month: 1 }),
    Expense.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" }
        }
      }
    ])
  ]);

  const monthlyIncome = await Income.aggregate([
    { $match: { date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { $month: "$date" },
        total: { $sum: "$amount" }
      }
    }
  ]);

  const expenseMap = Object.fromEntries(monthly.map((x) => [x._id, x.total]));
  const incomeMap = Object.fromEntries(monthlyIncome.map((x) => [x._id, x.total]));

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: incomeMap[i + 1] || 0,
    expenses: expenseMap[i + 1] || 0,
    balance: (incomeMap[i + 1] || 0) - (expenseMap[i + 1] || 0)
  }));

  res.json({
    success: true,
    data: {
      year,
      income,
      expenses,
      balance: income - expenses,
      savingsRate: income > 0 ? Number((((income - expenses) / income) * 100).toFixed(2)) : 0,
      salaryTotal: salaries.reduce((sum, item) => sum + item.amount, 0),
      months
    }
  });
});