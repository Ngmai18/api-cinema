const Order = require("../models/orderModel");
const ReleasedTime = require("../models/releasedTimeModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    nameFilm,
    nameCinema,
    address,
    date,
    time,
    seats,
    price,
    promotion,
    quantity,
    ticket,
    paymentInfo,
    itemsPrice,
    totalPrice,
    dateFind,
  } = req.body;

  const order = await Order.create({
    nameFilm,
    nameCinema,
    address,
    date,
    time,
    seats,
    price,
    promotion,
    quantity,
    ticket,
    paymentInfo,
    itemsPrice,
    totalPrice,
    dateFind,
    paidAt: Date.now(),
    user: req.user._id,
    userName: req.user.name,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Không tìm thấy đơn đặt hàng với Id này", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const ordersCount = await Order.countDocuments();
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  let filteredOrdersCount = orders.length;
  res.status(200).json({
    success: true,
    totalAmount,
    filteredOrdersCount,
    ordersCount,
    orders,
  });
});
exports.getAllOrdersAndFil = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const ordersCount = await Order.countDocuments();

  const apiFeature = new ApiFeatures(Order.find(), req.query)
    .byCinema()
    .byFilm()
    .byDate()
    .filter();
  let orders = await apiFeature.query;

  let filteredOrdersCount = orders.length;

  apiFeature.pagination(resultPerPage);

  orders = await apiFeature.query;

  res.status(200).json({
    success: true,
    orders,
    ordersCount,
    resultPerPage,
    filteredOrdersCount,
  });
});
// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Không tìm thấy đơn đặt hàng với Id này", 404));
  }

  if (order.orderStatus === "Đang xử lý") {
    return next(new ErrorHander("Đơn hàng này đã được bạn xử lý", 400));
  }

  if (req.body.status === "Đã xong") {
    order.forEach(async (o) => {
      await updateStock(o.ticket, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Đang xử lý") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const releasedTime = await ReleasedTime.findById(id);
  releasedTime.Stock -= quantity;
  await releasedTime.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Không tìm thấy đơn đặt hàng với Id này", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
