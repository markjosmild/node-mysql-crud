const express = require("express");
const app = express();
const db = require("./database/database"); // Import the database connection
const userRoute = require("./routers/userRoute");

app.use(express.json());

app.use("/auth", userRoute);
app.use("/users", userRoute);

app.listen(8001, () => console.log("app is running on port " + 8001));
