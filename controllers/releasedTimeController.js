const ReleasedTime = require("../models/releasedTimeModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//create
exports.createReleasedTime = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const releasedTime = await ReleasedTime.create(req.body);
  res.status(201).json({
    success: true,
    releasedTime,
  });
});

// Get All
exports.getReleasedTime = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const releasedTimesCount = await ReleasedTime.countDocuments();

  const apiFeature = new ApiFeatures(ReleasedTime.find(), req.query)
    .searchByFilm()
    .filter();

  let releasedTimes = await apiFeature.query;

  let filteredReleasedTimesCount = releasedTimes.length;

  apiFeature.pagination(resultPerPage);

  releasedTimes = await apiFeature.query;

  res.status(200).json({
    success: true,
    releasedTimes,
    releasedTimesCount,
    resultPerPage,
    filteredReleasedTimesCount,
  });
});

exports.getAdminReleasedTime = catchAsyncErrors(async (req, res, next) => {
  const releasedTimes = await ReleasedTime.find();
  res.status(200).json({
    success: true,
    releasedTimes,
  });
});
// update
exports.updateReleasedTime = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
    category: req.body.category,
  };
  const releasedTime = await ReleasedTime.findByIdAndUpdate(
    req.params.id,
    newData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    releasedTime,
  });
});

exports.getReleasedTimeDetails = catchAsyncErrors(async (req, res, next) => {
  const releasedTime = await ReleasedTime.findById(req.params.id);

  if (!releasedTime) {
    return next(new ErrorHander("Không tìm thấy lịch chiếu", 404));
  }

  res.status(200).json({
    success: true,
    releasedTime,
  });
});

// Delete Orders

exports.deleteReleasedTime = catchAsyncErrors(async (req, res, next) => {
  const releasedTime = await ReleasedTime.findById(req.params.id);

  if (!releasedTime) {
    return next(new ErrorHander("Không tìm thấy lịch chiếu", 404));
  }
  await releasedTime.remove();

  res.status(200).json({
    success: true,
    message: "Xóa lịch chiếu thành công !",
  });
});
