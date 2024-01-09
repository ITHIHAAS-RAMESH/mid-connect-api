const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routers/userRoutes");
const postRoute = require("./routers/postRoute");
dotenv.config();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "hello" });
});

app.use("/users", userRoute);
app.use("/post", postRoute);
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("connected to DB");
    app.listen(3500, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
