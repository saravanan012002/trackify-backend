require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const noteRoutes = require("./routes/noteRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    app: "Trackify API",
    version: "1.0.0",
    message: "Trackify backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "OK" });
});

app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/reports", reportRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(err.errors).map((e) => e.message)
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID"
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "This record already exists"
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Trackify] Server running at http://localhost:${PORT}`);
});