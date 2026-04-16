const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const authRoutes = require("./routes/auth.route.js");
const eventRoutes = require("./routes/events.route.js")
const bookinRoutes = require("./routes/booking.route.js")


const app = express();
app.use(cors());
app.use(express.json())

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes)
app.use("/api/v1/booking", bookinRoutes)


//DB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`MongoDB connected`);
  })
  .catch((error) => {
    console.log(`Error while connecting to MongoDB`, error);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZGI4MGVhZGU1MTYzM2MwNTUxMjJiMyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc1OTkzMTAwLCJleHAiOjE3NzY1OTc5MDB9.njSeyh9wV6oP8zJGYzydIjKB9LlpgomIJmio3t4q_2E