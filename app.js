const express = require('express'); 
const mongoose = require("mongoose"); 
const app = express(); 
const path = require('path'); 
const Upload = require("./models/upload.js")
const methodOverride = require("method-override")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.engine("ejs", ejsMate); 


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
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

app.get("/" , (req,res)=>

{
    res.send("Hi i am root ")
})

//routes
const uploadRoute = require("./routes/upload.js")

app.use("/" , uploadRoute);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});