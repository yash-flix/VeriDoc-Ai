const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  fileType: { type: String, enum: ["document", "image", "video", "text"], required: true },
  fileUrl: String,     // Cloudinary URL
  fileName: String,
  cloudinaryId: String,
  result: {
    authenticityScore: { type: Number, default: null },
    anomalies: [String],
    verifiedAgainst: [String],
    status: { type: String, enum: ["pending", "authentic", "suspicious", "fake"], default: "pending" }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Upload", uploadSchema);
