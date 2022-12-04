const mongoose = require("mongoose");
const cinemaSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Chọn ảnh"],
  },
  name: {
    type: String,
    required: [true, "Nhập tên rạp"],
  },
  address: {
    type: String,
    required: [true, "Nhập địa chỉ"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Cinema", cinemaSchema);
