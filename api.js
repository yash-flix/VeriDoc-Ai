const express = require("express");
const Upload = require("../models/upload");
const verifyFile = require("../services/verifyFile");

const router = express.Router();

// GET all documents (optional filtering)
router.get("/documents", async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter["result.status"] = req.query.status;
        if (req.query.fileType) filter["fileType"] = req.query.fileType;

        const docs = await Upload.find(filter).sort({ createdAt: -1 });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET status of a document
router.get("/status/:id", async (req, res) => {
    try {
        const doc = await Upload.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: "Document not found" });
        res.json(doc.result);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST verify a document manually
router.post("/verify/:id", async (req, res) => {
    try {
        const doc = await Upload.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: "Document not found" });

        const verificationResult = await verifyFile(doc);
        doc.result = verificationResult;
        await doc.save();

        res.json({ success: true, result: verificationResult });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST manually approve a document
router.post("/approve/:id", async (req, res) => {
    try {
        const doc = await Upload.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: "Document not found" });

        doc.result = { status: "verified", authenticityScore: 100 };
        await doc.save();
        res.json({ success: true, result: doc.result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST manually reject a document
router.post("/reject/:id", async (req, res) => {
    try {
        const doc = await Upload.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: "Document not found" });

        doc.result = { status: "rejected", authenticityScore: 0 };
        await doc.save();
        res.json({ success: true, result: doc.result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
