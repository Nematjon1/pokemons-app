const express = require("express");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

const PORT = 5000;


// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/pokemons"));

// Serve assets in production
if(process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  })
}

app.listen(PORT, () => console.log(`Server started ...`));
