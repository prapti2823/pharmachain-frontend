import { useState } from 'react';
import { qrAPI } from '../utils/api';
import Loader from './Loader';
import Alert from './Alert';

const QRVerification = () => {
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!qrData.trim()) {
      setError('Please enter QR data');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await qrAPI.verify(qrData);
      setResult(response.data);
    } catch (err) {
      setError('Failed to verify QR code');
      console.error('QR verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">QR Code Verification</h3>
          <p className="text-sm text-slate-600">Verify QR code authenticity without image scanning</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            QR Code Data
          </label>
          <textarea
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Paste encrypted QR code data here..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || !qrData.trim()}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader size="sm" />
              Verifying...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verify QR Code
            </>
          )}
        </button>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {result && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-800 mb-3">Verification Result:</h4>
            
            {result.status === 'valid' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Valid QR Code</span>
                </div>
                
                {result.qr_data && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Medicine ID:</span>
                      <p className="font-mono">{result.qr_data.medicine_id}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Batch Number:</span>
                      <p className="font-mono">{result.qr_data.batch_number}</p>
                    </div>
                  </div>
                )}

                {result.medicine_details && (
                  <div className="mt-4 p-3 bg-white rounded border">
                    <h5 className="font-medium text-slate-800 mb-2">Medicine Details:</h5>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-slate-600">Name:</span> {result.medicine_details.medicine_name}</p>
                      <p><span className="text-slate-600">Manufacturer:</span> {result.medicine_details.manufacturer}</p>
                      <p><span className="text-slate-600">Expiry:</span> {result.medicine_details.expiry_date}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-medium">Invalid QR Code</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRVerification;