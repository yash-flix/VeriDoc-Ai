require("dotenv").config();

const express = require('express'); 
const mongoose = require("mongoose"); 
const app = express(); 
const path = require('path'); 
const Upload = require("./models/upload.js")
const ejsMate = require("ejs-mate"); 
const methodOverride = require("method-override")
const apiRoutes = require("./routes/api.js"); 
const uploadRoute = require("./routes/upload.js")

const session = require("express-session");
const flash = require("connect-flash");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate); 

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(methodOverride("_method"));

const MONGO_URL = "mongodb://127.0.0.1:27017/VeriDoc";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then((res) => {
    console.log("MongoDB is connected");
})
.catch((err) => {
    console.log("MongoDB connection error:", err);
});


app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: true
}));

app.use(flash());


app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});


app.get("/home", (req, res) => {
    res.render("home.ejs")
})

app.get("/dashboard", async (req, res) => {
    try {
        const uploads = await Upload.find({});
        res.render("dashboard.ejs", { uploads });
    } catch (err) {
        console.error("Error fetching uploads:", err);
        req.flash("error_msg", "Failed to load dashboard");
        res.redirect("/home");
    }
})


app.use("/api", apiRoutes);
app.use("/", uploadRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
