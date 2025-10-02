module.exports = async function verifyFile(upload)
{
      if (upload.fileType === "document") {
    return {
      authenticityScore: 85,
      anomalies: ["watermark detected"],
      verifiedAgainst: ["gov_database"],
      status: "suspicious"
    };
  }
  return {
    authenticityScore: 95,
    anomalies: [],
    verifiedAgainst: ["trusted_dataset"],
    status: "authentic"
  };
};

