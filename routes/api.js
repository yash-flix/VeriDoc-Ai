const express = require("express");
const router = express.Router();
const Upload = require("../models/upload");
const verifyFile = require("../services/verifyFile");

// Verify document
router.post("/verify/:id", async (req, res) => {
  console.log("Verify route hit for ID:", req.params.id);
  try {
    const upload = await Upload.findById(req.params.id);
    console.log("Found upload:", upload);
    
    if (!upload) {
      return res.status(404).json({ error: "Upload not found" });
    }

    // ✅ This is INSIDE the route handler - correct!
    const result = await verifyFile(upload);
    console.log("Verification result:", result);
    
    upload.result = result;
    await upload.save();

    res.json({ success: true, result: upload.result });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Verification failed", details: err.message });
  }
});

// Approve document
router.post("/approve/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ error: "Upload not found" });
    }

    upload.result = { 
      status: "approved", 
      authenticityScore: 100,
      anomalies: [],
      verifiedAgainst: ['Manual Approval']
    };
    await upload.save();

    res.json({ success: true, result: upload.result });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ error: "Approval failed" });
  }
});

// Reject document
router.post("/reject/:id", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ error: "Upload not found" });
    }

    upload.result = { 
      status: "rejected", 
      authenticityScore: 0,
      anomalies: ['Manually rejected by reviewer'],
      verifiedAgainst: ['Manual Review']
    };
    await upload.save();

    res.json({ success: true, result: upload.result });
  } catch (err) {
    console.error("Rejection error:", err);
    res.status(500).json({ error: "Rejection failed" });
  }
});

module.exports = router;
