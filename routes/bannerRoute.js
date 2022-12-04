const express = require("express");
const {
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner,
  getAdminBanner,
} = require("../controllers/bannerController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router
  .route("/admin/banner/create")
  .post(isAuthenticatedUser, authorizeRoles("admin", "manager"), createBanner);
router
  .route("/admin/banners")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminBanner);
router.route("/banners").get(getBanner);
router
  .route("/admin/banner/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateBanner)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBanner);

module.exports = router;
