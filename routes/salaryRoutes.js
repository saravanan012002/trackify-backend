const router = require("express").Router();
const controller = require("../controllers/salaryController");

router.post("/", controller.createSalary);
router.get("/", controller.getSalaries);
router.get("/:id", controller.getSalary);
router.put("/:id", controller.updateSalary);
router.delete("/:id", controller.deleteSalary);

module.exports = router;