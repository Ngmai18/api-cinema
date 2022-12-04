const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const coupon = require("./routes/couponRoute");
const banner = require("./routes/bannerRoute");
const feedback = require("./routes/feedbackRoute");
const newFeed = require("./routes/newFeedRoute");
const cinema = require("./routes/cinemaRoute");
const film = require("./routes/filmRoute");
const releasedTime = require("./routes/releasedTimeRoute");
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", coupon);
app.use("/api/v1", banner);
app.use("/api/v1", feedback);
app.use("/api/v1", newFeed);
app.use("/api/v1", cinema);
app.use("/api/v1", film);
app.use("/api/v1", releasedTime);
// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
