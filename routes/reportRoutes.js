const router = require("express").Router();
const controller = require("../controllers/reportController");

router.get("/monthly", controller.getMonthlyReport);
router.get("/yearly", controller.getYearlyReport);

module.exports = router;