const express = require("express");
const router = express.Router();
const Upload = require("../models/upload");
const verifyFile = require("../services/verifyFile"); // adjust path if needed

// Verify document
router.post("/verify/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ error: "Upload not found" });

    const result = await verifyFile(upload); // call your verifyFile.js
    upload.result = result;
    await upload.save();

    res.json({ success: true, result: upload.result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// Approve document
router.post("/approve/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ error: "Upload not found" });

    upload.result = { status: "approved", authenticityScore: 100 };
    await upload.save();

    res.json({ success: true, result: upload.result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Approval failed" });
  }
});

// Reject document
router.post("/reject/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ error: "Upload not found" });

    upload.result = { status: "rejected", authenticityScore: 0 };
    await upload.save();

    res.json({ success: true, result: upload.result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Rejection failed" });
  }
});

module.exports = router;
