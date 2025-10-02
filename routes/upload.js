const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const Upload = require("../models/upload");
const verifyFile = require("../services/verifyFile");

const upload = multer({ storage });
const router = express.Router();

// Upload page
router.get("/upload", (req, res) => {
    res.render("index");
});

// Upload file
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        
        const existing = await Upload.findOne({ fileName: req.file.originalname });
        if (existing) {
            console.log("Duplicate upload skipped.");
            return res.redirect("/dashboard");
        }

        const fileType = req.body.fileType || "document";
        const newUpload = new Upload({
            fileType,
            fileUrl: req.file.path,
            fileName: req.file.originalname,
            cloudinaryId: req.file.filename || req.file.public_id,
            result: { status: "pending" }
        });

        await newUpload.save();

       
        res.redirect("/dashboard");

        
        verifyFile(newUpload)
            .then(result => {
                newUpload.result = result;
                return newUpload.save();
            })
            .catch(err => {
                console.error("Verification Error:", err);
                newUpload.result = { status: "failed", authenticityScore: 0 };
                newUpload.save();
            });

    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ success: false, message: "Upload failed", error: err });
    }
});

// Dashboard
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
