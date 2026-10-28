const express = require("express");
const mongoose = require("mongoose");

const bookRoutes = require("./routes/routes2");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/library")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log(error);
    });

app.use("/api/books", bookRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});