const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const port = process.env.PORT || 8000;

const connectDB = require("./database/db.js");

const authRoutes = require("./routes/auth.js")
const listingRoutes = require("./routes/listing.js")
const bookingRoutes = require("./routes/booking.js")
const userRoutes = require("./routes/user.js")


const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

/* routes */
app.use("/auth", authRoutes)
app.use("/properties", listingRoutes)
app.use("/bookings", bookingRoutes)
app.use("/users", userRoutes)

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});



