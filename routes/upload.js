const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const Upload = require("../models/upload");
const verifyFile = require("../services/verifyFile");

const upload = multer({ storage });
const router = express.Router();

router.get("/upload" , (req,res)=>
{
    res.render("index")
})
router.post("/upload" , upload.single("file") , async (req,res)=>
{
    try{
        const fileType = req.body.fileType || "document";
        const newUpload = new Upload(
            {
                fileType,
                fileUrl:req.file.path,
                fileName:req.file.originalname,
                cloudinaryId:req.file.filename || req.file.public_id,
                result:{status: "pending"}
            }
        );
        await newUpload.save();
         res.json({ success: true, upload: newUpload });
//verification in background
         const verificationResult = await verifyFile(newUpload)
         newUpload.result = verificationResult;
         await newUpload.save();

    }catch(err)
    {
        console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: "Upload failed", error: err });
    }
})
module.exports = router;