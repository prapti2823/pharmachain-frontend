import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../../components/QRScanner';
import CameraCapture from '../../components/CameraCapture';
import ImageUploader from '../../components/ImageUploader';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';
import { pharmacyAPI } from '../../utils/api';

const ScanVerify = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [qrData, setQrData] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanMethod, setScanMethod] = useState('camera'); // 'camera' or 'upload'
  const [imageMethod, setImageMethod] = useState('camera'); // 'camera' or 'upload'
  const navigate = useNavigate();

  const handleQRScan = (data) => {
    setQrData(data);
    setCurrentStep(2);
    setError('');
  };

  const handleImageCapture = (imageFile) => {
    setCapturedImage(imageFile);
    setCurrentStep(3);
  };

  const handleVerification = async () => {
    if (!qrData || !capturedImage) {
      setError('Please complete both QR scan and image capture');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('qr_data', qrData);
      formData.append('scanned_image', capturedImage);

      const response = await pharmacyAPI.verifyMedicine(formData);
      
      navigate('/pharmacy/verification-result', {
        state: { verificationResult: response.data }
      });
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setCurrentStep(1);
    setQrData('');
    setCapturedImage(null);
    setError('');
  };

  const steps = [
    { number: 1, title: 'Scan QR Code', description: 'Scan the QR code on medicine package' },
    { number: 2, title: 'Capture Image', description: 'Take photo of medicine package' },
    { number: 3, title: 'AI Verification', description: 'Get instant authenticity results' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/pharmacy')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Medicine Verification</h1>
                <p className="text-sm text-slate-600">AI-powered authenticity check</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-cyan-600 text-white shadow-lg' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {currentStep > step.number ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-slate-800' : 'text-slate-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                    currentStep > step.number ? 'bg-cyan-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Step 1: QR Scanning */}
          <div className={`bg-white rounded-xl border-2 transition-all duration-300 ${
            currentStep === 1 ? 'border-cyan-500 shadow-lg' : 'border-slate-200'
          }`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  <span className="text-sm font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Scan QR Code</h3>
                {qrData && (
                  <div className="ml-auto">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setScanMethod('camera')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        scanMethod === 'camera' 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Camera Scan
                    </button>
                    <button
                      onClick={() => setScanMethod('upload')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        scanMethod === 'upload' 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Upload Image
                    </button>
                  </div>

                  {scanMethod === 'camera' ? (
                    <QRScanner onScanSuccess={handleQRScan} />
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                      <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-slate-600 mb-2">Upload QR code image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const { Html5Qrcode } = await import('html5-qrcode');
                              const html5QrCode = new Html5Qrcode("qr-reader");
                              const qrCodeMessage = await html5QrCode.scanFile(file, true);
                              handleQRScan(qrCodeMessage);
                            } catch (err) {
                              setError('Failed to read QR code from image');
                            }
                          }
                        }}
                        className="hidden"
                        id="qr-upload"
                      />
                      <label
                        htmlFor="qr-upload"
                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-cyan-700 transition-colors"
                      >
                        Choose File
                      </label>
                      <div id="qr-reader" style={{display: 'none'}}></div>
                    </div>
                  )}
                </div>
              )}

              {qrData && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm text-emerald-700 font-medium">✅ QR Code Scanned Successfully</p>
                  <p className="text-xs text-emerald-600 mt-1 font-mono">{qrData.substring(0, 50)}...</p>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Image Capture */}
          <div className={`bg-white rounded-xl border-2 transition-all duration-300 ${
            currentStep === 2 ? 'border-cyan-500 shadow-lg' : 'border-slate-200'
          }`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  <span className="text-sm font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800">Capture Package Image</h3>
                  <p className="text-xs text-slate-600">AI will compare with manufacturer's original image</p>
                </div>
                {capturedImage && (
                  <div className="ml-auto">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {currentStep >= 2 && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-emerald-800 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                      Medicine Package Photo
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">Take or upload a clear photo for AI comparison with the manufacturer's original image stored in blockchain</p>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setImageMethod('camera')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        imageMethod === 'camera' 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Camera Photo
                    </button>
                    <button
                      onClick={() => setImageMethod('upload')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        imageMethod === 'upload' 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Upload Image
                    </button>
                  </div>
                  
                  {!capturedImage ? (
                    imageMethod === 'camera' ? (
                      <CameraCapture onCapture={handleImageCapture} />
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                        <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-slate-600 mb-2">Upload medicine package image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleImageCapture(file);
                            }
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="bg-cyan-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-cyan-700 transition-colors"
                        >
                          Choose File
                        </label>
                      </div>
                    )
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(capturedImage)}
                          alt="Captured medicine package"
                          className="w-full h-48 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          onClick={() => setCapturedImage(null)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-sm text-emerald-700 font-medium">✅ Image Captured Successfully</p>
                        <p className="text-xs text-emerald-600 mt-1">Ready for AI verification</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep < 2 && (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  <p className="text-slate-500">Complete QR scan first</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={resetProcess}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            Reset Process
          </button>
          
          {qrData && capturedImage && (
            <button
              onClick={handleVerification}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size="sm" />
                  Verifying...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Start AI Verification
                </>
              )}
            </button>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="font-semibold text-slate-800 mb-4">Verification Tips</h4>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600">
            <div>
              <h5 className="font-medium text-slate-800 mb-2">QR Code Scanning:</h5>
              <ul className="space-y-1">
                <li>• Ensure good lighting conditions</li>
                <li>• Hold camera steady and close to QR code</li>
                <li>• Make sure QR code is not damaged or obscured</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-slate-800 mb-2">Package Photography:</h5>
              <ul className="space-y-1">
                <li>• Capture or upload the entire medicine package</li>
                <li>• Ensure clear focus and good lighting</li>
                <li>• Include all visible text and branding</li>
                <li>• Supported formats: JPG, PNG, WEBP</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ScanVerify;