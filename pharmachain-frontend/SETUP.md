# PharmaChain Frontend Setup Guide

## Quick Start

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Access Application**
   - Open browser to `http://localhost:5173`
   - No login required - direct access to functionality

## Application Structure

### Landing Page (`/`)
- Portal selection interface
- Choose between Manufacturer or Pharmacy workflows

### Manufacturer Portal (`/manufacturer`)
- **Dashboard**: Overview and quick actions
- **Register Batch** (`/manufacturer/register-batch`): Add new medicine batches
- **View Batches** (`/manufacturer/batches`): List all registered batches
- **Batch Details** (`/manufacturer/batch/:id`): Individual batch information
- **Watchdog Monitor** (`/manufacturer/watchdog`): Fraud detection system

### Pharmacy Portal (`/pharmacy`)
- **Dashboard**: Overview and verification guide
- **Scan & Verify** (`/pharmacy/scan-verify`): QR scanning and image capture
- **Verification Result** (`/pharmacy/verification-result`): AI analysis results
- **Report** (`/pharmacy/report`): Final verification documentation

## API Integration

The frontend integrates with these backend endpoints:

### Manufacturer APIs
- `POST /manufacturer/register-batch` - Register new medicine batch
- `GET /manufacturer/batches` - Get all registered batches
- `POST /watchdog/start-monitoring` - Start fraud monitoring
- `GET /watchdog/status` - Check monitoring status

### Pharmacy APIs
- `POST /pharmacy/verify-medicine` - Verify medicine authenticity

### QR & Search APIs
- `POST /qr/verify` - Verify QR code data
- `GET /medicine/search` - Search medicines by name

## Key Features

### No Authentication Required
- Direct access to all functionality
- No login/logout process
- Simplified user experience

### Real-time Verification
- Camera-based QR scanning
- AI-powered image comparison
- Blockchain verification
- Trust score calculation

### Mobile-Friendly
- Responsive design
- Touch-friendly interface
- Camera access for scanning

## Configuration

Update API base URL in `src/utils/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000'; // Your backend URL
```

## Testing Without Backend

The application includes demo data for testing frontend functionality without a backend server. Components will gracefully handle API errors and show appropriate messages.

## Build for Production

```bash
npm run build
npm run preview
```

## Browser Support

- Chrome/Edge (recommended for camera features)
- Firefox
- Safari
- Mobile browsers with camera support