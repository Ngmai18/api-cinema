const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  nameFilm: {
    type: String,
  },
  nameCinema: {
    type: String,
  },
  address: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  // seats: {
  //   type: String,
  // },
  seats: [
    {
      id: {
        type: String,
      },
      number: {
        type: String,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  promotion: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
  },
  ticket: {
    type: mongoose.Schema.ObjectId,
    ref: "ReleasedTime",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  dateFind: {
    type: String,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Đã xong",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
