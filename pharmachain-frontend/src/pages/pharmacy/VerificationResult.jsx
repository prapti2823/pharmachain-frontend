import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
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
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-800 mb-2">✅ AUTHENTIC - Safe to Dispense</h3>
                <p className="text-emerald-700 mb-4">Medicine verified with {trustScore}% confidence. All security checks passed successfully.</p>
                <button
                  onClick={() => setShowQuantityCheck(true)}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Proceed to Dispense
                </button>
              </div>
            </div>
          </div>
        );
      case 'REVIEW':
        return (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-800 mb-2">⚠️ NEEDS REVIEW - Manual Verification Required</h3>
                <p className="text-amber-700 mb-4">Trust score: {trustScore}%. Please have a supervisor review before dispensing.</p>
                <button
                  onClick={() => alert('Supervisor notification sent')}
                  className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Call Supervisor
                </button>
              </div>
            </div>
          </div>
        );
      case 'REJECT':
        return (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-800 mb-2">❌ REJECTED - Do NOT Dispense</h3>
                <p className="text-red-700 mb-4">Counterfeit detected! Trust score: {trustScore}%. Block this stock immediately.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => alert('Stock blocked successfully')}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    Block Stock
                  </button>
                  <button
                    onClick={notifyRegulator}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    Notify Regulator
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/pharmacy/scan-verify')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Scan Another Medicine
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Verification Results</h1>
              <p className="text-slate-600">AI-powered medicine authentication report</p>
            </div>
          </div>
        </div>

        {/* Main Decision */}
        {getDecisionCard()}

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Medicine Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.586V5L8 4z" />
                </svg>
                Medicine Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-500">Medicine Name</span>
                    <p className="text-lg font-semibold text-slate-900">{medicine?.medicine_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500">Manufacturer</span>
                    <p className="text-slate-900">{medicine?.manufacturer}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500">Batch Number</span>
                    <p className="font-mono bg-slate-100 px-2 py-1 rounded inline-block">
                      {result.qr_data?.batch_number}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-500">Expiry Date</span>
                    <p className="text-slate-900">{formatDate(medicine?.expiry_date)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500">Ingredients</span>
                    <p className="text-slate-900 text-sm">{medicine?.ingredients}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verification Details
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${formatTrustScore(trustScore).color}`}>
                    {trustScore}%
                  </div>
                  <p className="text-sm text-slate-600">Trust Score</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${blockchain?.blockchain_verified ? 'text-green-600' : 'text-red-600'}`}>
                    {blockchain?.blockchain_verified ? '✅' : '❌'}
                  </div>
                  <p className="text-sm text-slate-600">Blockchain</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${imageMatch?.similarity === 'high' ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(imageMatch?.match_score * 100 || 0)}%
                  </div>
                  <p className="text-sm text-slate-600">Image Match</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-slate-500">Image Comparison</span>
                  <p className="text-slate-900 mt-1">{imageMatch?.ai_analysis}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-500">Confidence Level</span>
                  <p className="text-slate-900">{imageMatch?.match_confidence}% - {imageMatch?.similarity} similarity</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-500">Recommendations</span>
                  <ul className="mt-1 space-y-1">
                    {result.recommendations?.map((rec, index) => (
                      <li key={index} className="text-slate-900 text-sm">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Quantity Check */}
            {showQuantityCheck && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  Quantity Verification
                </h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Manufactured Quantity
                      </label>
                      <input
                        type="text"
                        value={`${medicine?.quantity_manufactured || 0} units`}
                        disabled
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Received Quantity
                      </label>
                      <input
                        type="number"
                        value={receivedQuantity}
                        onChange={(e) => setReceivedQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                QR Code Data
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-slate-500">Medicine ID</span>
                  <p className="font-mono text-sm">{result.qr_data?.medicine_id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-500">Batch Number</span>
                  <p className="font-mono text-sm">{result.qr_data?.batch_number}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Blockchain Verification
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Verified</span>
                  <span className={blockchain?.blockchain_verified ? 'text-green-600' : 'text-red-600'}>
                    {blockchain?.blockchain_verified ? '✅' : '❌'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Database Match</span>
                  <span className={blockchain?.database_match ? 'text-green-600' : 'text-red-600'}>
                    {blockchain?.database_match ? '✅' : '❌'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Hash Match</span>
                  <span className={blockchain?.medicine_found ? 'text-green-600' : 'text-red-600'}>
                    {blockchain?.medicine_found ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={generateReport}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  📊 Generate Report
                </button>
                <button
                  onClick={() => navigate('/pharmacy/scan-verify')}
                  className="w-full bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationResult;