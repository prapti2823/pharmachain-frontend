import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../../components/QRScanner';
import CameraCapture from '../../components/CameraCapture';
import ImageUploader from '../../components/ImageUploader';
import { pharmacyAPI } from '../../utils/api';

const ScanVerify = () => {
  const [qrData, setQrData] = useState('');
  const [scannedImage, setScannedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanMethod, setScanMethod] = useState('qr');
  const [imageMethod, setImageMethod] = useState('camera');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifying Medicine</h3>
          <p className="text-gray-600">AI is analyzing your submission...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/pharmacy')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Medicine Verification</h1>
                <p className="text-sm text-gray-500">Scan QR code and capture package image</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI Ready</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Verification Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${qrData ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${qrData ? 'bg-green-100' : 'bg-gray-100'}`}>
                {qrData ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">1</span>
                )}
              </div>
              <span className="font-medium">QR Code</span>
            </div>
            
            <div className={`w-16 h-0.5 ${qrData ? 'bg-green-300' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center space-x-2 ${scannedImage ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scannedImage ? 'bg-green-100' : 'bg-gray-100'}`}>
                {scannedImage ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">2</span>
                )}
              </div>
              <span className="font-medium">Package Image</span>
            </div>
            
            <div className={`w-16 h-0.5 ${qrData && scannedImage ? 'bg-green-300' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center space-x-2 ${qrData && scannedImage ? 'text-cyan-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${qrData && scannedImage ? 'bg-cyan-100' : 'bg-gray-100'}`}>
                <span className="text-sm font-medium">3</span>
              </div>
              <span className="font-medium">AI Verification</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Step 1: QR Code</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setScanMethod('qr')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      scanMethod === 'qr'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Camera
                  </button>
                  <button
                    onClick={() => setScanMethod('manual')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      scanMethod === 'manual'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {scanMethod === 'qr' ? (
                <div className="text-center">
                  <QRScanner
                    onScanSuccess={handleQRScan}
                    onScanError={handleQRError}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter QR Code Data
                  </label>
                  <textarea
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Paste encrypted QR code data here..."
                  />
                </div>
              )}

              {qrData && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-800">QR Code Captured</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1 font-mono break-all">
                    {qrData.substring(0, 60)}...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Image Capture Section */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Step 2: Package Image</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setImageMethod('camera')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      imageMethod === 'camera'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Camera
                  </button>
                  <button
                    onClick={() => setImageMethod('upload')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      imageMethod === 'upload'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
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
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-800">Image Captured</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    {scannedImage.name} • {Math.round(scannedImage.size / 1024)} KB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleVerify}
            disabled={!qrData || !scannedImage}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11.207 8.5a1 1 0 00-1.414-1.414L6.586 10.293a.5.5 0 00-.146.353V13a1 1 0 001 1h2.354a.5.5 0 00.353-.146l2.06-2.061z" clipRule="evenodd" />
            </svg>
            <span>Verify Medicine Authenticity</span>
          </button>
          <p className="text-sm text-gray-500 mt-3">
            AI will analyze blockchain data and compare package images
          </p>
        </div>

        {/* Tips */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4">Verification Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">QR Code Scanning</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Hold camera steady over QR code</li>
                <li>• Ensure good lighting conditions</li>
                <li>• QR code should fill the camera frame</li>
                <li>• Wait for automatic detection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Package Photography</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Capture clear, high-resolution image</li>
                <li>• Include brand name and batch details</li>
                <li>• Avoid shadows and reflections</li>
                <li>• Ensure all text is readable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanVerify;