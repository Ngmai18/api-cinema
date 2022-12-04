const Film = require("../models/filmModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// Create Film -- Admin
exports.createFilm = catchAsyncErrors(async (req, res, next) => {
  // let images = [];

  // if (typeof req.body.images === "string") {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }

  // const imagesLinks = [];

  // for (let i = 0; i < images.length; i++) {
  //   const result = await cloudinary.v2.uploader.upload(images[i], {
  //     folder: "films",
  //   });

  //   imagesLinks.push({
  //     public_id: result.public_id,
  //     url: result.secure_url,
  //   });
  // }

  // req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const film = await Film.create(req.body);

  res.status(201).json({
    success: true,
    film,
  });
});

// Get All Film
exports.getAllFilms = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const filmsCount = await Film.countDocuments();

  const apiFeature = new ApiFeatures(Film.find(), req.query).search().filter();

  let films = await apiFeature.query;

  let filteredFilmsCount = films.length;

  apiFeature.pagination(resultPerPage);

  films = await apiFeature.query;

  res.status(200).json({
    success: true,
    films,
    filmsCount,
    resultPerPage,
    filteredFilmsCount,
  });
});
exports.getDailyFilm = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const filmsCount = await Film.countDocuments();

  const apiFeature = new ApiFeatures(
    Film.find({ category: "Phim đang chiếu", hideFilm: "hiện" }),
    req.query
  )
    .search()
    .filter();

  let films = await apiFeature.query;

  let filteredFilmsCount = films.length;

  apiFeature.pagination(resultPerPage);

  films = await apiFeature.query;

  res.status(200).json({
    success: true,
    films,
    filmsCount,
    resultPerPage,
    filteredFilmsCount,
  });
});
exports.getComingFilm = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const filmsCount = await Film.countDocuments();

  const apiFeature = new ApiFeatures(
    Film.find({ category: "Sắp ra mắt ", hideFilm: "hiện" }),
    req.query
  );

  let films = await apiFeature.query;

  let filteredFilmsCount = films.length;

  apiFeature.pagination(resultPerPage);

  films = await apiFeature.query;

  res.status(200).json({
    success: true,
    films,
    filmsCount,
    resultPerPage,
    filteredFilmsCount,
  });
});
// Get All Film (Admin)
exports.getAdminFilms = catchAsyncErrors(async (req, res, next) => {
  const films = await Film.find();

  res.status(200).json({
    success: true,
    films,
  });
});

// Get Film Details
exports.getFilmDetails = catchAsyncErrors(async (req, res, next) => {
  const film = await Film.findById(req.params.id);

  if (!film) {
    return next(new ErrorHander("Không tìm thấy sản phẩm", 404));
  }

  res.status(200).json({
    success: true,
    film,
  });
});

// Update Film -- Admin

exports.updateFilm = catchAsyncErrors(async (req, res, next) => {
  let film = await Film.findById(req.params.id);

  if (!film) {
    return next(new ErrorHander("Không tìm thấy phim", 404));
  }

  film = await Film.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    film,
  });
});

// Delete Film

exports.deleteFilm = catchAsyncErrors(async (req, res, next) => {
  const film = await Film.findById(req.params.id);

  if (!film) {
    return next(new ErrorHander("Không tìm thấy phim", 404));
  }

  // Deleting Images From Cloudinary
  // for (let i = 0; i < film.images.length; i++) {
  //   await cloudinary.v2.uploader.destroy(film.images[i].public_id);
  // }

  await film.remove();

  res.status(200).json({
    success: true,
    message: "Xóa thành công",
  });
});

// Create New Review or Update the review
exports.createFilmReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, filmId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    userImage: req.user.avatar.url,
    rating: Number(rating),
    comment,
  };

  const film = await Film.findById(filmId);

  const isReviewed = film.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    film.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    film.reviews.push(review);
    film.numOfReviews = film.reviews.length;
  }

  let avg = 0;

  film.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  film.ratings = avg / film.reviews.length;

  await film.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a film
exports.getFilmReviews = catchAsyncErrors(async (req, res, next) => {
  const film = await Film.findById(req.query.id);

  if (!film) {
    return next(new ErrorHander("Không tìm thấy phim", 404));
  }

  res.status(200).json({
    success: true,
    reviews: film.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const film = await Film.findById(req.query.filmId);

  if (!film) {
    return next(new ErrorHander("Không tìm thấy sản phẩm", 404));
  }

  const reviews = film.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Film.findByIdAndUpdate(
    req.query.filmId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
