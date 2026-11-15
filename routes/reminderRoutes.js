const router = require("express").Router();
const controller = require("../controllers/reminderController");

router.post("/", controller.createReminder);
router.get("/", controller.getReminders);
router.get("/:id", controller.getReminder);
router.put("/:id", controller.updateReminder);
router.delete("/:id", controller.deleteReminder);

module.exports = router;