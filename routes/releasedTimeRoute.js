const express = require("express");
const {
  deleteReleasedTime,
  createReleasedTime,
  getReleasedTime,
  updateReleasedTime,
  getAdminReleasedTime,
  getReleasedTimeDetails,
} = require("../controllers/releasedTimeController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/releasedTimes").get(getReleasedTime);
router
  .route("/admin/releasedTime/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createReleasedTime);
router
  .route("/admin/releasedTimes")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminReleasedTime);
router.route("/releasedTime/:id").get(getReleasedTimeDetails);
router
  .route("/admin/releasedTime/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateReleasedTime)
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin", "manager"),
    deleteReleasedTime
  );

module.exports = router;
