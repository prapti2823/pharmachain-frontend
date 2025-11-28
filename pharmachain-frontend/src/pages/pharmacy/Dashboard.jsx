import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';

const PharmacyDashboard = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    acceptedMedicines: 0,
    rejectedMedicines: 0,
    reviewRequired: 0
  });
  const navigate = useNavigate();
  const pharmacy = 'Default Pharmacy';

  useEffect(() => {
    // Load stats from localStorage or API
    const savedStats = localStorage.getItem('pharmacyStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🏥 Pharmacy Dashboard</h1>
              <p className="text-gray-600">{pharmacy}</p>
            </div>
            <button
              onClick={goHome}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalScans}</div>
              <p className="text-sm text-gray-600 mt-1">Total Scans</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.acceptedMedicines}</div>
              <p className="text-sm text-gray-600 mt-1">Accepted</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.reviewRequired}</div>
              <p className="text-sm text-gray-600 mt-1">Need Review</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.rejectedMedicines}</div>
              <p className="text-sm text-gray-600 mt-1">Rejected</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/pharmacy/scan-verify')}
            className="bg-blue-600 text-white p-8 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-xl font-medium mb-2">Scan & Verify</div>
            <div className="text-sm opacity-90">Verify medicine authenticity with AI</div>
          </button>
          
          <button
            onClick={() => alert('Feature coming soon!')}
            className="bg-green-600 text-white p-8 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <div className="text-4xl mb-3">📊</div>
            <div className="text-xl font-medium mb-2">View Reports</div>
            <div className="text-sm opacity-90">Access verification history</div>
          </button>
          
          <button
            onClick={() => alert('Feature coming soon!')}
            className="bg-purple-600 text-white p-8 rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            <div className="text-4xl mb-3">⚠️</div>
            <div className="text-xl font-medium mb-2">Alert Center</div>
            <div className="text-sm opacity-90">View counterfeit alerts</div>
          </button>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="How It Works">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Scan QR Code</h4>
                  <p className="text-sm text-gray-600">Use camera to scan QR code on medicine package</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Capture Image</h4>
                  <p className="text-sm text-gray-600">Take photo of medicine package for AI comparison</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">AI Verification</h4>
                  <p className="text-sm text-gray-600">AI analyzes blockchain data and image authenticity</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Get Decision</h4>
                  <p className="text-sm text-gray-600">Receive ACCEPT, REVIEW, or REJECT recommendation</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="AI Decision Guide">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-green-600 text-lg mr-2">✅</span>
                  <span className="font-medium text-green-800">ACCEPT (80-100%)</span>
                </div>
                <p className="text-sm text-green-700">Medicine is authentic and safe to dispense</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-600 text-lg mr-2">⚠️</span>
                  <span className="font-medium text-yellow-800">REVIEW (60-79%)</span>
                </div>
                <p className="text-sm text-yellow-700">Manual verification required before dispensing</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <span className="text-red-600 text-lg mr-2">❌</span>
                  <span className="font-medium text-red-800">REJECT (0-59%)</span>
                </div>
                <p className="text-sm text-red-700">Counterfeit detected - do not dispense</p>
              </div>
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card title="System Status" className="mt-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-green-600 text-2xl mb-2">🟢</div>
              <p className="text-sm font-medium text-gray-900">AI Service</p>
              <p className="text-xs text-gray-600">Online</p>
            </div>
            <div className="text-center">
              <div className="text-green-600 text-2xl mb-2">🟢</div>
              <p className="text-sm font-medium text-gray-900">Blockchain</p>
              <p className="text-xs text-gray-600">Connected</p>
            </div>
            <div className="text-center">
              <div className="text-green-600 text-2xl mb-2">🟢</div>
              <p className="text-sm font-medium text-gray-900">QR Scanner</p>
              <p className="text-xs text-gray-600">Ready</p>
            </div>
            <div className="text-center">
              <div className="text-green-600 text-2xl mb-2">🟢</div>
              <p className="text-sm font-medium text-gray-900">Camera</p>
              <p className="text-xs text-gray-600">Available</p>
            </div>
          </div>
        </Card>

        {/* Safety Tips */}
        <Card title="Safety Tips" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Before Scanning:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Check package for physical tampering
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Verify expiry date is clearly visible
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Ensure QR code is not damaged
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Look for suspicious packaging differences
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">After Verification:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  ACCEPT: Safe to dispense to patient
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  REVIEW: Get supervisor approval first
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  REJECT: Block stock and report immediately
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Always generate verification report
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyDashboard;