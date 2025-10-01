const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const Upload = require("../models/upload");

const upload = multer({ storage });
const router = express.Router();

router.get("/upload" , (req,res)=>
{
    res.render("index")
})
module.exports = router;