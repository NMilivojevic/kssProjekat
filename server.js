const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

// Setting up the server
const app = express();
app.listen(5000);

// init middleware body parser
// app.use(bodyParser.json());old school
app.use(express.json());

// connection test start 
app.get("/", (req, res) => res.send("API Running."));
// connection test end 

// Define routes
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/profile", require("./routes/profile"));
app.use("/posts", require("./routes/posts"));

// Setting up the database
const connectDB = async () => {
    try {
        await mongoose.connect(config.get("mongoURI"));
        console.log("MongoDB Connected.")
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

connectDB();

