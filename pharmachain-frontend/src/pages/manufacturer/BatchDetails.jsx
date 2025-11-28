import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';
import { manufacturerAPI } from '../../utils/api';
import { formatDate, truncateHash } from '../../utils/formatters';

const BatchDetails = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatchDetails();
  }, [id]);

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      const response = await manufacturerAPI.getBatchDetails(id);
      setBatch(response.data);
    } catch (error) {
      console.error('Error fetching batch details:', error);
      setError('Failed to load batch details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader size="lg" text="Loading batch details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert
            type="error"
            title="Error Loading Batch"
            message={error}
            actions={[
              <button
                key="retry"
                onClick={fetchBatchDetails}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>,
              <button
                key="back"
                onClick={() => navigate('/manufacturer/batches')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to List
              </button>
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/manufacturer/batches')}
            className="text-blue-600 hover:text-blue-700 mb-2"
          >
            ← Back to Batches
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Batch Details</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Medicine Information">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Medicine Name</label>
                    <p className="text-lg font-semibold text-gray-900">{batch?.medicine_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Manufacturer</label>
                    <p className="text-gray-900">{batch?.manufacturer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Batch Number</label>
                    <p className="font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                      {batch?.batch_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                    <p className="text-gray-900">{formatDate(batch?.expiry_date)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Quantity Manufactured</label>
                    <p className="text-gray-900">{batch?.quantity_manufactured} units</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Storage Conditions</label>
                    <p className="text-gray-900">{batch?.storage || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-gray-900">{formatDate(batch?.created_at)}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Ingredients & Usage">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ingredients</label>
                  <p className="text-gray-900 mt-1">{batch?.ingredients}</p>
                </div>
                {batch?.usage && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Usage Instructions</label>
                    <p className="text-gray-900 mt-1">{batch?.usage}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Blockchain Verification">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Blockchain Hash</label>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {batch?.blockchain_hash}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    <span className="text-sm text-gray-600">Blockchain Verified</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">🔒</span>
                    <span className="text-sm text-gray-600">Tamper Proof</span>
                  </div>
                </div>
              </div>
            </Card>

            {batch?.ai_validation && (
              <Card title="AI Validation Results">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      batch.ai_validation.status === 'valid' 
                        ? 'text-green-600 bg-green-100' 
                        : 'text-red-600 bg-red-100'
                    }`}>
                      {batch.ai_validation.status === 'valid' ? '✅ Valid' : '❌ Invalid'}
                    </span>
                    <span className="ml-4 text-sm text-gray-600">
                      Confidence: {batch.ai_validation.confidence}%
                    </span>
                  </div>
                  {batch.ai_validation.analysis && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">AI Analysis</label>
                      <p className="text-gray-900 mt-1">{batch.ai_validation.analysis}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Medicine Image */}
            <Card title="Medicine Image">
              {batch?.image_url ? (
                <img
                  src={batch.image_url}
                  alt="Medicine package"
                  className="w-full rounded-lg border"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </Card>

            {/* QR Code */}
            <Card title="QR Code">
              {batch?.qr_code_base64 ? (
                <div className="text-center">
                  <img
                    src={`data:image/png;base64,${batch.qr_code_base64}`}
                    alt="QR Code"
                    className="mx-auto border rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `qr-${batch.batch_number}.png`;
                      link.href = `data:image/png;base64,${batch.qr_code_base64}`;
                      link.click();
                    }}
                    className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    📥 Download QR
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  QR code not available
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/manufacturer/register-batch')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  + Register New Batch
                </button>
                <button
                  onClick={() => navigate('/manufacturer/watchdog')}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  🔍 Watchdog Monitor
                </button>
                <button
                  onClick={fetchBatchDetails}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  🔄 Refresh Data
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetails;