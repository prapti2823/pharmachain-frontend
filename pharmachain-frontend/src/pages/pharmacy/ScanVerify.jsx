import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Loader from '../../components/Loader';
import QRScanner from '../../components/QRScanner';
import CameraCapture from '../../components/CameraCapture';
import ImageUploader from '../../components/ImageUploader';
import { pharmacyAPI } from '../../utils/api';

const ScanVerify = () => {
  const [qrData, setQrData] = useState('');
  const [scannedImage, setScannedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanMethod, setScanMethod] = useState('qr'); // 'qr' or 'manual'
  const [imageMethod, setImageMethod] = useState('camera'); // 'camera' or 'upload'
  const navigate = useNavigate();

  const handleQRScan = (data) => {
    setQrData(data);
    setError('');
  };

  const handleQRError = (error) => {
    console.error('QR Scan error:', error);
  };

  const handleImageCapture = (file) => {
    setScannedImage(file);
    setError('');
  };

  const handleVerify = async () => {
    if (!qrData) {
      setError('Please scan or enter QR code data');
      return;
    }

    if (!scannedImage) {
      setError('Please capture or upload medicine package image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('qr_data', qrData);
      formData.append('scanned_image', scannedImage);

      const response = await pharmacyAPI.verifyMedicine(formData);
      
      // Navigate to results page with verification data
      navigate('/pharmacy/verification-result', { 
        state: { verificationResult: response.data } 
      });
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.response?.data?.detail || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader size="lg" text="🤖 AI is verifying medicine authenticity..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/pharmacy')}
            className="text-blue-600 hover:text-blue-700 mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">🔍 Scan & Verify Medicine</h1>
          <p className="text-gray-600">AI-powered authenticity verification</p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <Card title="Step 1: Scan QR Code">
            <div className="space-y-4">
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setScanMethod('qr')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scanMethod === 'qr'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📱 Camera Scan
                </button>
                <button
                  onClick={() => setScanMethod('manual')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scanMethod === 'manual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ⌨️ Manual Entry
                </button>
              </div>

              {scanMethod === 'qr' ? (
                <QRScanner
                  onScanSuccess={handleQRScan}
                  onScanError={handleQRError}
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter QR Code Data
                  </label>
                  <textarea
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste QR code data here..."
                  />
                </div>
              )}

              {qrData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">✅ QR Code Captured</p>
                  <p className="text-green-600 text-xs mt-1 font-mono break-all">
                    {qrData.substring(0, 50)}...
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Image Capture Section */}
          <Card title="Step 2: Capture Package Image">
            <div className="space-y-4">
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setImageMethod('camera')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageMethod === 'camera'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📷 Camera
                </button>
                <button
                  onClick={() => setImageMethod('upload')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageMethod === 'upload'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📁 Upload
                </button>
              </div>

              {imageMethod === 'camera' ? (
                <CameraCapture
                  onCapture={handleImageCapture}
                  label="Capture Medicine Package"
                />
              ) : (
                <ImageUploader
                  onImageSelect={handleImageCapture}
                  label="Upload Medicine Package Image"
                />
              )}

              {scannedImage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">✅ Image Captured</p>
                  <p className="text-green-600 text-xs mt-1">
                    {scannedImage.name} ({Math.round(scannedImage.size / 1024)} KB)
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Verification Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleVerify}
            disabled={!qrData || !scannedImage}
            className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🤖 Verify Medicine Authenticity
          </button>
          <p className="text-sm text-gray-600 mt-2">
            AI will compare images and verify blockchain data
          </p>
        </div>

        {/* Instructions */}
        <Card title="Verification Instructions" className="mt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">QR Code Scanning:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hold camera steady over QR code</li>
                <li>• Ensure good lighting</li>
                <li>• QR code should fill most of the frame</li>
                <li>• Wait for automatic detection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Package Photography:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Capture clear image of medicine package</li>
                <li>• Include brand name and batch details</li>
                <li>• Avoid shadows and reflections</li>
                <li>• Ensure text is readable</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScanVerify;