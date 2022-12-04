const express = require("express");
const {
  getAllFilms,
  createFilm,
  updateFilm,
  deleteFilm,
  getFilmDetails,
  createFilmReview,
  getFilmReviews,
  deleteReview,
  getAdminFilms,
  getDailyFilm,
  getComingFilm,
} = require("../controllers/filmController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/films").get(getAllFilms);
router.route("/dailyFilms").get(getDailyFilm);
router.route("/comingFilms").get(getComingFilm);
router
  .route("/admin/films")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminFilms);

router
  .route("/admin/film/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createFilm);

router
  .route("/admin/film/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateFilm)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteFilm);

router.route("/film/:id").get(getFilmDetails);

router.route("/review").put(isAuthenticatedUser, createFilmReview);

router.route("/reviews/").get(getFilmReviews);
router.route("/reviews/").delete(isAuthenticatedUser, deleteReview);
module.exports = router;
