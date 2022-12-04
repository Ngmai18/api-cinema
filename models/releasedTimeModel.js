const mongoose = require("mongoose");
const releasedTimeSchema = new mongoose.Schema({
  film: {
    type: String,
    required: [true, "Chọn phim"],
  },
  cinema: {
    type: String,
    required: [true, "Chọn cụm rạp"],
  },
  logoCinema: {
    type: String,
    required: [true, "Nhập link ảnh"],
  },
  poster: {
    type: String,
    required: [true, "Nhập link ảnh"],
  },
  brand: {
    type: String,
    required: [true, "Chọn rạp"],
  },
  address: {
    type: String,
    required: [true, "Nhập địa chỉ"],
  },
  price: {
    type: String,
    required: [true, "Nhập giá"],
  },
  promotion: {
    type: String,
    default: 0,
    maxLength: [3, "Nhập % khuyến mãi"],
  },
  date: {
    type: String,
    required: [true, "Nhập ngày"],
  },
  time: {
    type: String,
    required: [true, "Nhập thời gian"],
  },
  seats: {
    type: String,
    // required: true,
  },
  Stock: {
    type: Number,
    default: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("ReleasedTime", releasedTimeSchema);
