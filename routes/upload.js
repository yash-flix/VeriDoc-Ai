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
    const existing = await Upload.findOne({ fileName: req.file.originalname });

if (existing) {
  console.log("Duplicate upload skipped.");
  return res.redirect("/dashboard");
}
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
         res.redirect("/dashboard");
        //  res.json({ success: true, upload: newUpload });
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

router.get("/dashboard", async (req, res) => {
    try {
        const uploads = await Upload.aggregate([
            { $sort: { createdAt: -1 } },  // newest first
            { $group: { _id: "$fileName", doc: { $first: "$$ROOT" } } }, // pick latest per file
            { $replaceRoot: { newRoot: "$doc" } } // flatten to normal doc
        ]);

        res.render("dashboard.ejs", { uploads });
    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).send("Error loading dashboard");
    }
});

module.exports = router;