const router = require("express").Router();
const controller = require("../controllers/noteController");

router.post("/", controller.createNote);
router.get("/", controller.getNotes);
router.get("/:id", controller.getNote);
router.put("/:id", controller.updateNote);
router.delete("/:id", controller.deleteNote);

module.exports = router;