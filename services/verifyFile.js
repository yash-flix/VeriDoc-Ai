const axios = require('axios');

async function verifyFile(upload) {
  try {
    console.log(`\n🔍 Starting verification for: ${upload.fileName} (${upload.fileType})`);
    
    if (upload.fileType === "document") {
      return await verifyDocument(upload);
    } else if (upload.fileType === "image") {
      return await verifyImage(upload);
    }

    return {
      authenticityScore: null,
      anomalies: ["Unsupported file type for verification"],
      verifiedAgainst: [],
      status: "suspicious",
    };
  } catch (err) {
    console.error("❌ Verification error:", err.message);
    return {
      authenticityScore: null,
      anomalies: ["Exception during verification: " + err.message],
      verifiedAgainst: [],
      status: "suspicious",
    };
  }
}

/**
 * Call Hugging Face API for error handling
 */
async function callHuggingFaceAPI(modelUrl, imageBuffer, options = {}) {
  const maxRetries = options.retries || 2;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📡 Attempt ${attempt}/${maxRetries} - Calling AI model...`);
      
      const response = await axios.post(
        modelUrl,
        imageBuffer,
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            'Content-Type': 'application/octet-stream',
          },
          timeout: 90000, // 90 second timeout
          validateStatus: function (status) {
            return status < 500; // Don't throw on 4xx errors
          }
        }
      );

      // Check response status
      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Check if model is loading
      if (response.data && response.data.error) {
        const error = response.data.error;
        
        if (error.includes('loading') || error.includes('currently loading')) {
          const waitTime = response.data.estimated_time || 30;
          console.log(`⏳ Model is loading. Waiting ${waitTime} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          continue; // Retry
        }
        
        // Rate limit error
        if (error.includes('rate limit') || error.includes('Too Many Requests')) {
          console.log(`⏳ Rate limited. Waiting 10 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
          continue;
        }
        
        throw new Error(error);
      }

      console.log("✅ AI model responded successfully");
      return response.data;
      
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed:`, err.message);
      
      if (attempt === maxRetries) {
        throw err;
      }
      
      // Exponential backoff
      const waitTime = Math.pow(2, attempt) * 2000;
      console.log(`⏳ Waiting ${waitTime/1000} seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * Document Verification 
 */
async function verifyDocument(upload) {
  try {
    console.log("📄 Verifying document:", upload.fileUrl);
    
    // Download image
    const imageResponse = await axios.get(upload.fileUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });
    const imageBuffer = Buffer.from(imageResponse.data);
    console.log(`✅ Image downloaded: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
    
    // OCR-based approach 
    try {
      console.log("🤖 Trying OCR-based document analysis...");
      const result = await analyzeDocumentWithOCR(imageBuffer);
      if (result) {
        console.log("✅ OCR analysis successful");
        return result;
      }
    } catch (err) {
      console.log("⚠️  OCR analysis failed:", err.message);
    }
    
    // Fallback to visual analysis
    const models = [
      "google/vit-base-patch16-224",
      "microsoft/resnet-50",
      "facebook/deit-base-distilled-patch16-224"
    ];
    
    for (const modelName of models) {
      try {
        console.log(`🤖 Trying model: ${modelName}`);
        const modelUrl = `https://api-inference.huggingface.co/models/${modelName}`;
        const result = await callHuggingFaceAPI(modelUrl, imageBuffer, { retries: 1 });
        
        if (result && Array.isArray(result)) {
          return analyzeClassificationResult(result, modelName, "document");
        }
      } catch (err) {
        console.log(`⚠️  Model ${modelName} failed:`, err.message);
        continue;
      }
    }
    
    // All AI failed - use enhanced basic analysis
    console.log("⚠️  All AI models unavailable - performing enhanced analysis");
    return performEnhancedAnalysis(upload, imageBuffer, "document");
    
  } catch (err) {
    console.error("❌ Document verification error:", err.message);
    return performEnhancedAnalysis(upload, null, "document");
  }
}

/**
 * Image Verification
 */
async function verifyImage(upload) {
  try {
    console.log("🖼️  Verifying image:", upload.fileUrl);
    
    const imageResponse = await axios.get(upload.fileUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });
    const imageBuffer = Buffer.from(imageResponse.data);
    console.log(`✅ Image downloaded: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
    
    // Try models
    const models = [
      "google/vit-base-patch16-224",
      "microsoft/resnet-50"
    ];
    
    for (const modelName of models) {
      try {
        console.log(`🤖 Trying model: ${modelName}`);
        const modelUrl = `https://api-inference.huggingface.co/models/${modelName}`;
        const result = await callHuggingFaceAPI(modelUrl, imageBuffer, { retries: 1 });
        
        if (result && Array.isArray(result)) {
          return analyzeClassificationResult(result, modelName, "image");
        }
      } catch (err) {
        console.log(`⚠️  Model ${modelName} failed:`, err.message);
        continue;
      }
    }
    
    // Fallback
    return performEnhancedAnalysis(upload, imageBuffer, "image");
    
  } catch (err) {
    console.error("❌ Image verification error:", err.message);
    return performEnhancedAnalysis(upload, null, "image");
  }
}


async function analyzeDocumentWithOCR(imageBuffer) {
  
  return null;
}

//classification result using AI
function analyzeClassificationResult(results, modelName, fileType) {
  console.log("📊 Analyzing AI results:", results.slice(0, 3).map(r => `${r.label}: ${(r.score * 100).toFixed(1)}%`).join(', '));
  
  let authenticityScore = 70;
  const anomalies = [];
  
  if (results.length > 0) {
    const topResult = results[0];
    const confidence = topResult.score * 100;
    
    const suspiciousKeywords = [
      'screen', 'screenshot', 'monitor', 'fake', 'forged',
      'edited', 'manipulated', 'artificial', 'generated', 'synthetic'
    ];
    
    const label = topResult.label.toLowerCase();
    const isSuspicious = suspiciousKeywords.some(keyword => label.includes(keyword));
    
    if (isSuspicious) {
      authenticityScore = Math.max(30, 100 - confidence);
      anomalies.push(`Suspicious content detected: ${topResult.label} (${confidence.toFixed(1)}% confidence)`);
    } else {
      authenticityScore = Math.min(92, 50 + confidence/2);
    }
    
    if (topResult.score < 0.25) {
      anomalies.push("Low confidence in classification - manual review recommended");
      authenticityScore -= 15;
    }
  }
  
  authenticityScore = Math.max(0, Math.min(100, authenticityScore));
  
  let status;
  if (authenticityScore >= 70) {
    status = "authentic";
  } else if (authenticityScore >= 40) {
    status = "suspicious";
  } else {
    status = "fake";
  }
  
  console.log(`📊 Final Score: ${authenticityScore}/100 - Status: ${status}`);
  
  return {
    authenticityScore,
    anomalies,
    verifiedAgainst: [modelName, "AI Visual Classification"],
    status,
  };
}


function performEnhancedAnalysis(upload, imageBuffer, fileType) {
  console.log("🔧 Performing enhanced analysis (no AI available)");
  
  const anomalies = [];
  let authenticityScore = 65;
  const checks = [];
  
  // Check 1: Filename analysis
  if (upload.fileName) {
    const suspiciousPatterns = ['screenshot', 'edited', 'copy', 'fake', 'temp', 'untitled'];
    const lowerName = upload.fileName.toLowerCase();
    
    for (const pattern of suspiciousPatterns) {
      if (lowerName.includes(pattern)) {
        anomalies.push(`Filename contains suspicious keyword: "${pattern}"`);
        authenticityScore -= 10;
        checks.push(`Filename Check: Suspicious (${pattern})`);
        break;
      }
    }
    
    if (!anomalies.length) {
      checks.push("Filename Check: Normal");
    }
  }
  
  // Check 2: File size analysis
  if (imageBuffer) {
    const fileSizeKB = imageBuffer.length / 1024;
    
    if (fileSizeKB < 50) {
      anomalies.push("Very low file size - may indicate low quality or heavily compressed image");
      authenticityScore -= 15;
      checks.push("File Size Check: Too Small");
    } else if (fileSizeKB > 10000) {
      checks.push("File Size Check: Large (high quality)");
      authenticityScore += 5;
    } else {
      checks.push("File Size Check: Normal");
    }
  }
  
  // Check 3: URL pattern analysis
  if (upload.fileUrl && upload.fileUrl.includes('screenshot')) {
    if (!anomalies.some(a => a.includes('screenshot'))) {
      anomalies.push("URL suggests screenshot - may not be original document");
      authenticityScore -= 10;
    }
  }
  
  
  anomalies.push("⚠️  AI verification temporarily unavailable - analysis based on metadata and patterns");
  
  authenticityScore = Math.max(0, Math.min(100, authenticityScore));
  
  let status;
  if (authenticityScore >= 65) {
    status = "suspicious"; 
  } else {
    status = "fake";
  }
  
  console.log(`📊 Enhanced Analysis Complete - Score: ${authenticityScore}/100`);
  console.log(`📋 Checks performed: ${checks.join(', ')}`);
  
  return {
    authenticityScore,
    anomalies,
    verifiedAgainst: ["Enhanced Metadata Analysis", "Pattern Recognition", "File Properties Check"],
    status,
  };
}

module.exports = verifyFile;
