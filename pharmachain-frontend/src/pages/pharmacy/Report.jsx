import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { formatDate, formatTrustScore, getDecisionColor } from '../../utils/formatters';

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const result = location.state?.verificationResult;
  const quantityCheck = location.state?.quantityCheck;
  const receivedQuantity = location.state?.receivedQuantity;

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert
            type="error"
            title="No Report Data"
            message="Please complete a verification first"
            actions={[
              <button
                key="scan"
                onClick={() => navigate('/pharmacy/scan-verify')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Verification
              </button>
            ]}
          />
        </div>
      </div>
    );
  }

  const decision = result.verification_result?.ai_decision;
  const trustScore = result.verification_result?.trust_score || 0;
  const medicine = result.medicine_details;
  const blockchain = result.blockchain_verification;
  const imageMatch = result.image_matching;

  const downloadReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      pharmacy: localStorage.getItem('pharmacy'),
      medicine: medicine,
      verification: result.verification_result,
      blockchain: blockchain,
      imageMatch: imageMatch,
      quantityCheck: quantityCheck,
      recommendations: result.recommendations
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification-report-${medicine?.batch_number}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const getRecommendationColor = (recommendation) => {
    if (recommendation.includes('Safe to dispense')) return 'text-green-600 bg-green-100';
    if (recommendation.includes('Block stock')) return 'text-red-600 bg-red-100';
    if (recommendation.includes('Report to authority')) return 'text-purple-600 bg-purple-100';
    return 'text-blue-600 bg-blue-100';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/pharmacy')}
              className="text-blue-600 hover:text-blue-700 mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">📊 Verification Report</h1>
            <p className="text-gray-600">Complete analysis and recommendations</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={printReport}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              🖨️ Print
            </button>
            <button
              onClick={downloadReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              📥 Download
            </button>
          </div>
        </div>

        {/* Report Header */}
        <Card title="Verification Summary">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className={`text-3xl font-bold ${getDecisionColor(decision)}`}>
                {decision}
              </div>
              <p className="text-sm text-gray-600 mt-1">AI Decision</p>
            </div>
            <div>
              <div className={`text-3xl font-bold ${formatTrustScore(trustScore).color}`}>
                {trustScore}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Trust Score</p>
            </div>
            <div>
              <div className={`text-3xl font-bold ${blockchain?.blockchain_verified ? 'text-green-600' : 'text-red-600'}`}>
                {blockchain?.blockchain_verified ? '✅' : '❌'}
              </div>
              <p className="text-sm text-gray-600 mt-1">Blockchain</p>
            </div>
            <div>
              <div className={`text-3xl font-bold ${imageMatch?.similarity === 'high' ? 'text-green-600' : 'text-red-600'}`}>
                {Math.round(imageMatch?.match_score * 100 || 0)}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Image Match</p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card title="Medicine Details">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Medicine Name</span>
                    <p className="font-semibold text-gray-900">{medicine?.medicine_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Manufacturer</span>
                    <p className="text-gray-900">{medicine?.manufacturer}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Batch Number</span>
                    <p className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                      {medicine?.batch_number}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Expiry Date</span>
                    <p className="text-gray-900">{formatDate(medicine?.expiry_date)}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Ingredients</span>
                  <p className="text-gray-900 text-sm mt-1">{medicine?.ingredients}</p>
                </div>
              </div>
            </Card>

            <Card title="Verification Process">
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">QR Code Verification</span>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Medicine ID</span>
                      <span className="font-mono text-sm">{result.qr_data?.medicine_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Batch Number</span>
                      <span className="font-mono text-sm">{result.qr_data?.batch_number}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Blockchain Verification</span>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Blockchain Verified</span>
                      <span className={blockchain?.blockchain_verified ? 'text-green-600' : 'text-red-600'}>
                        {blockchain?.blockchain_verified ? '✅ Yes' : '❌ No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Database Match</span>
                      <span className={blockchain?.database_match ? 'text-green-600' : 'text-red-600'}>
                        {blockchain?.database_match ? '✅ Yes' : '❌ No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Hash Match</span>
                      <span className={blockchain?.hash_match ? 'text-green-600' : 'text-red-600'}>
                        {blockchain?.hash_match ? '✅ Yes' : '❌ No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Image Analysis</span>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Match Score</span>
                      <span className="font-semibold">{Math.round(imageMatch?.match_score * 100 || 0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Similarity</span>
                      <span className="capitalize">{imageMatch?.similarity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Confidence</span>
                      <span>{imageMatch?.match_confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {quantityCheck && (
              <Card title="Quantity Verification">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Manufactured</span>
                    <span>{medicine?.quantity_manufactured} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Received</span>
                    <span>{receivedQuantity} units</span>
                  </div>
                  <Alert
                    type={quantityCheck.type}
                    message={quantityCheck.message}
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card title="AI Analysis">
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Image Comparison Analysis</span>
                  <p className="text-gray-900 mt-1 text-sm">{imageMatch?.ai_analysis}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Trust Level</span>
                  <p className="text-gray-900 mt-1">{result.verification_result?.trust_level}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Confidence Score</span>
                  <p className="text-gray-900 mt-1">{result.verification_result?.confidence}%</p>
                </div>
              </div>
            </Card>

            <Card title="Recommendations">
              <div className="space-y-3">
                {result.recommendations?.map((recommendation, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${getRecommendationColor(recommendation)}`}
                  >
                    <p className="text-sm font-medium">{recommendation}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Report Information">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Pharmacy</span>
                  <span className="text-sm">Default Pharmacy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Verification Date</span>
                  <span className="text-sm">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Report ID</span>
                  <span className="text-sm font-mono">
                    RPT-{Date.now().toString().slice(-8)}
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Next Steps">
              <div className="space-y-3">
                {decision === 'ACCEPT' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 font-medium text-sm">✅ Safe to Dispense</p>
                    <p className="text-green-600 text-xs mt-1">
                      Medicine is authentic and safe for patient use
                    </p>
                  </div>
                )}
                {decision === 'REVIEW' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 font-medium text-sm">⚠️ Manual Review Required</p>
                    <p className="text-yellow-600 text-xs mt-1">
                      Have supervisor verify before dispensing
                    </p>
                  </div>
                )}
                {decision === 'REJECT' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 font-medium text-sm">❌ Do Not Dispense</p>
                    <p className="text-red-600 text-xs mt-1">
                      Block stock and report to authorities
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/pharmacy/scan-verify')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Verify Another Medicine
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;