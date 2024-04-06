require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

const movieRoutes = require("./routes/movie-routes");
const userRoutes = require("./routes/user-routes");

app.use(express.json());
app.use(cors());

app.use("/api/movies", movieRoutes);

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});