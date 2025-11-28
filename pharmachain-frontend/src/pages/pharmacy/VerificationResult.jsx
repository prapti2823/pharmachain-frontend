import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { formatDate, formatTrustScore, getDecisionColor } from '../../utils/formatters';

const VerificationResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQuantityCheck, setShowQuantityCheck] = useState(false);
  const [receivedQuantity, setReceivedQuantity] = useState('');
  const [quantityAlert, setQuantityAlert] = useState(null);

  const result = location.state?.verificationResult;

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert
            type="error"
            title="No Verification Data"
            message="Please scan a medicine first"
            actions={[
              <button
                key="scan"
                onClick={() => navigate('/pharmacy/scan-verify')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Scan Medicine
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

  const handleQuantityCheck = () => {
    if (!receivedQuantity) {
      setQuantityAlert({ type: 'error', message: 'Please enter received quantity' });
      return;
    }

    const manufactured = parseInt(medicine?.quantity_manufactured || 0);
    const received = parseInt(receivedQuantity);
    const difference = received - manufactured;
    const percentDiff = ((difference / manufactured) * 100).toFixed(1);

    if (difference > 0) {
      setQuantityAlert({
        type: 'error',
        message: `⚠️ SUSPICIOUS: Received ${difference} more units than manufactured (${percentDiff}% excess)`
      });
    } else if (difference < 0) {
      setQuantityAlert({
        type: 'warning',
        message: `Missing ${Math.abs(difference)} units (${Math.abs(percentDiff)}% shortage)`
      });
    } else {
      setQuantityAlert({
        type: 'success',
        message: '✅ Quantity matches manufacturer records'
      });
    }
  };

  const generateReport = () => {
    navigate('/pharmacy/report', {
      state: {
        verificationResult: result,
        quantityCheck: quantityAlert,
        receivedQuantity
      }
    });
  };

  const notifyRegulator = () => {
    alert('Regulator notification sent! Incident report has been filed.');
  };

  const getDecisionCard = () => {
    switch (decision) {
      case 'ACCEPT':
        return (
          <Alert
            type="success"
            title="✅ AUTHENTIC - Safe to Dispense"
            message={`Medicine verified with ${trustScore}% confidence. All checks passed.`}
            actions={[
              <button
                key="dispense"
                onClick={() => setShowQuantityCheck(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Proceed to Dispense
              </button>
            ]}
          />
        );
      case 'REVIEW':
        return (
          <Alert
            type="warning"
            title="⚠️ NEEDS REVIEW - Manual Verification Required"
            message={`Trust score: ${trustScore}%. Please have a supervisor review before dispensing.`}
            actions={[
              <button
                key="review"
                onClick={() => alert('Supervisor notification sent')}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Call Supervisor
              </button>
            ]}
          />
        );
      case 'REJECT':
        return (
          <Alert
            type="error"
            title="❌ REJECTED - Do NOT Dispense"
            message={`Counterfeit detected! Trust score: ${trustScore}%. Block this stock immediately.`}
            actions={[
              <button
                key="block"
                onClick={() => alert('Stock blocked successfully')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors mr-2"
              >
                Block Stock
              </button>,
              <button
                key="notify"
                onClick={notifyRegulator}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Notify Regulator
              </button>
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/pharmacy/scan-verify')}
            className="text-blue-600 hover:text-blue-700 mb-2"
          >
            ← Scan Another Medicine
          </button>
          <h1 className="text-2xl font-bold text-gray-900">🔍 Verification Results</h1>
        </div>

        {/* Main Decision */}
        {getDecisionCard()}

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Medicine Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Medicine Information">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Medicine Name</span>
                    <p className="text-lg font-semibold text-gray-900">{medicine?.medicine_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Manufacturer</span>
                    <p className="text-gray-900">{medicine?.manufacturer}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Batch Number</span>
                    <p className="font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                      {medicine?.batch_number}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Expiry Date</span>
                    <p className="text-gray-900">{formatDate(medicine?.expiry_date)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Ingredients</span>
                    <p className="text-gray-900 text-sm">{medicine?.ingredients}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Verification Details">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${formatTrustScore(trustScore).color}`}>
                    {trustScore}%
                  </div>
                  <p className="text-sm text-gray-600">Trust Score</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${blockchain?.blockchain_verified ? 'text-green-600' : 'text-red-600'}`}>
                    {blockchain?.blockchain_verified ? '✅' : '❌'}
                  </div>
                  <p className="text-sm text-gray-600">Blockchain</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${imageMatch?.similarity === 'high' ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(imageMatch?.match_score * 100 || 0)}%
                  </div>
                  <p className="text-sm text-gray-600">Image Match</p>
                </div>
              </div>
            </Card>

            <Card title="AI Analysis">
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Image Comparison</span>
                  <p className="text-gray-900 mt-1">{imageMatch?.ai_analysis}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Confidence Level</span>
                  <p className="text-gray-900">{imageMatch?.match_confidence}% - {imageMatch?.similarity} similarity</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Recommendations</span>
                  <ul className="mt-1 space-y-1">
                    {result.recommendations?.map((rec, index) => (
                      <li key={index} className="text-gray-900 text-sm">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Quantity Check */}
            {showQuantityCheck && (
              <Card title="Quantity Verification">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manufactured Quantity
                      </label>
                      <input
                        type="text"
                        value={`${medicine?.quantity_manufactured || 0} units`}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Received Quantity
                      </label>
                      <input
                        type="number"
                        value={receivedQuantity}
                        onChange={(e) => setReceivedQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter received quantity"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleQuantityCheck}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Check Quantity
                  </button>
                  {quantityAlert && (
                    <Alert
                      type={quantityAlert.type}
                      message={quantityAlert.message}
                    />
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="QR Code Data">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Medicine ID</span>
                  <p className="font-mono text-sm">{result.qr_data?.medicine_id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Batch Number</span>
                  <p className="font-mono text-sm">{result.qr_data?.batch_number}</p>
                </div>
              </div>
            </Card>

            <Card title="Blockchain Verification">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verified</span>
                  <span className={blockchain?.blockchain_verified ? 'text-green-600' : 'text-red-600'}>
                    {blockchain?.blockchain_verified ? '✅' : '❌'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database Match</span>
                  <span className={blockchain?.database_match ? 'text-green-600' : 'text-red-600'}>
                    {blockchain?.database_match ? '✅' : '❌'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hash Match</span>
                  <span className={blockchain?.hash_match ? 'text-green-600' : 'text-red-600'}>
                    {blockchain?.hash_match ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Actions">
              <div className="space-y-3">
                <button
                  onClick={generateReport}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  📊 Generate Report
                </button>
                <button
                  onClick={() => navigate('/pharmacy/scan-verify')}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  🔍 Scan Another
                </button>
                {decision === 'REJECT' && (
                  <button
                    onClick={notifyRegulator}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    🚨 Report Counterfeit
                  </button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationResult;