# 🏭🏥 PharmaChain Frontend

Complete React + TailwindCSS frontend for the PharmaChain blockchain-based medicine authentication system.

## 🚀 Features

### 🏭 Manufacturer Portal
- **Batch Registration**: Register medicine batches with AI validation
- **QR Code Generation**: Generate tamper-proof QR codes for packages
- **Blockchain Integration**: Store medicine hashes on blockchain
- **Watchdog Monitoring**: Real-time fraud detection and alerts
- **Batch Management**: View and manage all registered batches

### 🏥 Pharmacy Portal
- **QR Scanner**: Camera-based QR code scanning
- **Image Verification**: AI-powered image comparison
- **Authenticity Check**: Blockchain verification with trust scores
- **Decision Engine**: ACCEPT/REVIEW/REJECT recommendations
- **Quantity Verification**: Detect suspicious quantity mismatches
- **Report Generation**: Comprehensive verification reports

## 🛠️ Tech Stack

- **React 19** - Frontend framework
- **Vite** - Build tool
- **TailwindCSS 4** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **html5-qrcode** - QR code scanning
- **qrcode** - QR code generation

## 📦 Installation

```bash
# Navigate to project directory
cd pharmachain-frontend

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

Update API base URL in `src/utils/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000'; // Your backend URL
```

## 🎯 Usage

### Manufacturer Workflow

1. **Login**: Access manufacturer portal
2. **Register Batch**: 
   - Fill medicine details
   - Upload package image
   - AI validates batch
   - Get QR code for printing
3. **Monitor**: Use watchdog for fraud detection
4. **Manage**: View all batches and details

### Pharmacy Workflow

1. **Login**: Access pharmacy portal
2. **Scan & Verify**:
   - Scan QR code with camera
   - Capture package image
   - AI verifies authenticity
3. **Review Results**:
   - Check trust score
   - Follow AI decision (ACCEPT/REVIEW/REJECT)
   - Verify quantities
4. **Generate Report**: Complete verification documentation

## 📱 Pages Structure

```
src/
├── pages/
│   ├── manufacturer/
│   │   ├── Login.jsx           # Manufacturer authentication
│   │   ├── Dashboard.jsx       # Overview and stats
│   │   ├── RegisterBatch.jsx   # Batch registration form
│   │   ├── BatchList.jsx       # All batches table
│   │   ├── BatchDetails.jsx    # Individual batch info
│   │   └── WatchdogMonitor.jsx # Fraud monitoring
│   └── pharmacy/
│       ├── Login.jsx           # Pharmacy authentication
│       ├── Dashboard.jsx       # Overview and guidance
│       ├── ScanVerify.jsx      # QR scan + image capture
│       ├── VerificationResult.jsx # AI analysis results
│       └── Report.jsx          # Final verification report
├── components/
│   ├── QRScanner.jsx          # Camera QR scanning
│   ├── QRGenerator.jsx        # QR code generation
│   ├── ImageUploader.jsx      # File upload with validation
│   ├── CameraCapture.jsx      # Camera photo capture
│   ├── Alert.jsx              # Notification component
│   ├── Card.jsx               # Content container
│   ├── Table.jsx              # Data table
│   └── Loader.jsx             # Loading states
└── utils/
    ├── api.js                 # Backend API calls
    ├── formatters.js          # Data formatting
    └── validators.js          # Form validation
```

## 🔐 Authentication

Simple localStorage-based authentication:
- Manufacturer: Stores manufacturer name
- Pharmacy: Stores pharmacy name
- Protected routes check user type

## 🎨 UI Components

### Decision Colors
- **🟢 ACCEPT**: Green (80-100% trust)
- **🟡 REVIEW**: Yellow (60-79% trust)  
- **🔴 REJECT**: Red (0-59% trust)

### Alert Levels
- **🟢 Safe**: Normal operations
- **🟡 Warning**: Requires attention
- **🔴 Critical**: Immediate action needed

## 📊 API Integration

### Manufacturer APIs
```javascript
POST /manufacturer/register-batch  # Register new batch
GET  /manufacturer/batches         # Get all batches
POST /watchdog/start-monitoring    # Start fraud monitoring
GET  /watchdog/status             # Check monitoring status
```

### Pharmacy APIs
```javascript
POST /pharmacy/verify-medicine     # Verify medicine authenticity
POST /qr/verify                   # Verify QR code
GET  /medicine/search             # Search medicines
```

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 Mobile Support

- Responsive design for all screen sizes
- Camera access for QR scanning
- Touch-friendly interface
- Optimized for mobile workflows

## 🔍 Key Features

### AI Integration
- Real-time batch validation
- Image similarity comparison
- Trust score calculation
- Fraud pattern detection

### Blockchain Integration
- Hash verification
- Tamper-proof records
- Decentralized validation
- Immutable audit trail

### Security Features
- Encrypted QR codes
- Image integrity checks
- Quantity mismatch detection
- Real-time monitoring

## 🎯 Production Ready

- Error handling and validation
- Loading states and feedback
- Print-friendly reports
- Accessibility compliance
- Cross-browser compatibility

## 📞 Support

For technical support or questions about the PharmaChain frontend, please refer to the API documentation and backend integration guide.

---

**Built with ❤️ for pharmaceutical supply chain security**