const router = require("express").Router();
const controller = require("../controllers/incomeController");

router.post("/", controller.createIncome);
router.get("/", controller.getIncomes);
router.get("/:id", controller.getIncome);
router.put("/:id", controller.updateIncome);
router.delete("/:id", controller.deleteIncome);

module.exports = router;