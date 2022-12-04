const Cinema = require("../models/cinemaModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//create
exports.createCinema = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const cinema = await Cinema.create(req.body);
  res.status(201).json({
    success: true,
    cinema,
  });
});

// Get All
exports.getCinema = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const cinemasCount = await Cinema.countDocuments();

  const apiFeature = new ApiFeatures(Cinema.find(), req.query)
    .search()
    .filter();

  let cinemas = await apiFeature.query;

  let filteredCinemasCount = cinemas.length;

  apiFeature.pagination(resultPerPage);

  cinemas = await apiFeature.query;

  res.status(200).json({
    success: true,
    cinemas,
    cinemasCount,
    resultPerPage,
    filteredCinemasCount,
  });
});

exports.getAdminCinema = catchAsyncErrors(async (req, res, next) => {
  const cinemas = await Cinema.find();
  res.status(200).json({
    success: true,
    cinemas,
  });
});
// update
exports.updateCinema = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    image: req.body.image,
    address: req.body.address,
  };
  const cinema = await Cinema.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    cinema,
  });
});

exports.getCinemaDetails = catchAsyncErrors(async (req, res, next) => {
  const cinema = await Cinema.findById(req.params.id);

  if (!cinema) {
    return next(new ErrorHander("Không tìm thấy rạp phim", 404));
  }

  res.status(200).json({
    success: true,
    cinema,
  });
});

// Delete Orders

exports.deleteCinema = catchAsyncErrors(async (req, res, next) => {
  const cinema = await Cinema.findById(req.params.id);

  if (!cinema) {
    return next(new ErrorHander("Không tìm thấy rạp phim", 404));
  }
  await cinema.remove();

  res.status(200).json({
    success: true,
    message: "Xóa rạp thành công !",
  });
});
