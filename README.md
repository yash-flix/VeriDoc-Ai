# VeriDocs AI – Intelligent Document & Media Verification System

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

> An AI-powered platform that verifies the authenticity of documents, images, and videos in real-time using multimodal machine learning models.

---

## 🔍 Overview

VeriDocs AI combats the growing problem of fake certificates, deepfake media, and fraudulent documents across education, employment, journalism, and business sectors. By leveraging cutting-edge AI models from Hugging Face and external verification APIs, it provides fast, automated, and scalable document authentication.

---

## ✨ Key Features

- **Document Verification**: Detect forged or altered certificates, transcripts, and contracts
- **Image Authentication**: Identify manipulated images and deepfakes using computer vision
- **Video Analysis**: Spot edited or synthetic video content with advanced classification
- **Text Validation**: Check for plagiarism and inconsistencies in resumes and documents
- **Real-time Processing**: Get instant verification results with confidence scores
- **History Tracking**: Maintain verification logs for audit trails

---

## 🎯 Use Cases

- **Students**: Verify academic certificates and transcripts
- **HR Teams**: Authenticate resumes and educational credentials
- **Journalists**: Confirm authenticity of viral media content
- **Companies**: Validate invoices, contracts, and vendor documents
- **Legal Professionals**: Check document authenticity for case evidence

---

## 🛠️ Tech Stack

### Frontend
- **EJS**: Server-side templating for dynamic pages
- **Bootstrap/Tailwind CSS**: Responsive UI design
- **JavaScript**: Interactive dashboard components

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **Multer**: File upload handling
- **Axios**: HTTP client for API requests

### Database
- **MongoDB**: Document storage and user verification history
- **Mongoose**: ODM for MongoDB interactions

### AI/ML Integration
- **Hugging Face API**: Multimodal AI models
  - Document Question Answering
  - Visual Document Retrieval
  - Image Segmentation & Classification
  - Video Classification
  - Text Similarity & Classification

### External APIs
- Google Reverse Image Search API
- News verification APIs
- Academic database integrations

---

## 📁 Project Structure

<img width="391" height="409" alt="VeriDocs AI Project Structure" src="https://github.com/user-attachments/assets/510eeb6d-7a48-4920-87c8-a9e536dc13b6" />

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Hugging Face API token
- npm or yarn package manager

### Installation

1. **Clone the repository**
git clone https://github.com/yash-flix/VeriDocs-AI.git
cd VeriDocs-AI

text

2. **Install dependencies**
npm install

text

3. **Configure environment variables**
cp .env.example .env

text

Edit `.env` with your credentials:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/veridocs
HUGGINGFACE_API_KEY=your_huggingface_token
GOOGLE_API_KEY=your_google_api_key
SESSION_SECRET=your_secret_key

text

4. **Start MongoDB**
mongod

text

5. **Run the application**
npm start

text

For development with auto-reload:
npm run dev

text

6. **Access the platform** at `http://localhost:3000`

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Verification
- `POST /api/verify/document` - Verify document authenticity
- `POST /api/verify/image` - Verify image authenticity
- `POST /api/verify/video` - Verify video content
- `GET /api/verify/history` - Retrieve verification history

### Upload
- `POST /api/upload` - Upload files for verification

---

## 🔧 Configuration

### Hugging Face Models Used

{
"document": "impira/layoutlm-document-qa",
"image": "openai/clip-vit-base-patch32",
"video": "MCG-NJU/videomae-base",
"text": "sentence-transformers/all-MiniLM-L6-v2"
}

text

### File Upload Limits

- **Documents**: PDF, DOCX (Max 10MB)
- **Images**: JPG, PNG (Max 5MB)
- **Videos**: MP4, AVI (Max 50MB)

---


## 📊 Verification Dashboard

The dashboard displays:

- **Authenticity Score**: Percentage-based confidence level
- **Anomaly Detection**: Specific issues found (mismatched fonts, artifacts, inconsistencies)
- **Cross-Reference Results**: External API validation results
- **Recommended Actions**: Next steps for manual review or alternative verification

---

## 🌟 Future Enhancements

- [ ] Blockchain integration for immutable verification records
- [ ] Mobile application (React Native)
- [ ] Bulk verification API for enterprise clients
- [ ] Advanced deepfake detection with GANs
- [ ] Integration with LinkedIn, university databases
- [ ] SaaS pricing model for businesses
- [ ] Real-time collaboration features for teams

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Yash Rane**
- GitHub: [@yash-flix](https://github.com/yash-flix)
- Email: [yash.tushar13@gmail.com](mailto:yash.tushar13@gmail.com)

---

## 🙏 Acknowledgments

- Hugging Face for providing state-of-the-art AI models
- MongoDB for robust database solutions
- The open-source community for invaluable tools and libraries

---

## 📞 Support

For questions or issues, please open an issue on GitHub or contact [yash.tushar13@gmail.com](mailto:yash.tushar13@gmail.com)

---

**Note**: This project is under active development. Features and documentation are continuously updated.
