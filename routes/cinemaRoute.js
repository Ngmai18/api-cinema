const express = require("express");
const {
  getCinema,
  createCinema,
  getAdminCinema,
  getCinemaDetails,
  updateCinema,
  deleteCinema,
} = require("../controllers/cinemaController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/cinemas").get(getCinema);
router
  .route("/admin/cinema/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createCinema);
router
  .route("/admin/cinemas")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminCinema);
router.route("/cinema/:id").get(getCinemaDetails);
router
  .route("/admin/cinema/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateCinema)
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin", "manager"),
    deleteCinema
  );

module.exports = router;
