const express = require("express");
const router = express.Router();
const {
  getShows,
  getShowById,
  createShow,
  deleteShow
} = require("../controllers/showController");

router.route("/")
  .get(getShows)
  .post(createShow);

router.route("/:id")
  .get(getShowById)
  .delete(deleteShow);

module.exports = router;

