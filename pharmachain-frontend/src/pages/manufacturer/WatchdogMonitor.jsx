import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Loader from '../../components/Loader';
import { watchdogAPI } from '../../utils/api';
import { getAlertColor } from '../../utils/formatters';

const WatchdogMonitor = () => {
  const [monitoring, setMonitoring] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus();
    // Poll status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const response = await watchdogAPI.getStatus();
      setStatus(response.data);
      setMonitoring(response.data.monitoring);
      
      // Simulate some alerts for demo
      if (response.data.monitoring) {
        generateMockAlerts();
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const generateMockAlerts = () => {
    const mockAlerts = [
      {
        id: 1,
        type: 'duplicate_qr',
        level: 'Warning',
        message: 'Duplicate QR code detected for batch PAR2024001',
        timestamp: new Date().toISOString(),
        details: 'QR code scanned from 2 different locations within 5 minutes'
      },
      {
        id: 2,
        type: 'time_anomaly',
        level: 'Safe',
        message: 'Normal scanning pattern detected',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        details: 'All QR scans within expected timeframes'
      },
      {
        id: 3,
        type: 'image_integrity',
        level: 'Critical',
        message: 'Image tampering detected in batch XYZ2024005',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        details: 'Original image hash does not match current package image'
      },
      {
        id: 4,
        type: 'batch_mismatch',
        level: 'Warning',
        message: 'Quantity mismatch in batch ABC2024010',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        details: 'Manufactured: 1000 units, Scanned: 1200 units'
      }
    ];
    setAlerts(mockAlerts);
  };

  const startMonitoring = async () => {
    try {
      setLoading(true);
      await watchdogAPI.startMonitoring();
      setMonitoring(true);
      setError('');
      generateMockAlerts();
    } catch (error) {
      console.error('Error starting monitoring:', error);
      setError('Failed to start monitoring');
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'duplicate_qr': return '🔄';
      case 'time_anomaly': return '⏰';
      case 'image_integrity': return '🖼️';
      case 'batch_mismatch': return '📊';
      default: return '⚠️';
    }
  };

  const getAlertTitle = (type) => {
    switch (type) {
      case 'duplicate_qr': return 'Duplicate QR Detection';
      case 'time_anomaly': return 'Time Anomaly Alert';
      case 'image_integrity': return 'Image Integrity Alert';
      case 'batch_mismatch': return 'Batch Mismatch Alert';
      default: return 'System Alert';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/manufacturer')}
            className="text-blue-600 hover:text-blue-700 mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">🔍 AI Watchdog Monitor</h1>
          <p className="text-gray-600">Real-time monitoring and fraud detection</p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <Card title="Monitoring Control">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    monitoring ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                  }`}>
                    {monitoring ? '🟢 Active' : '⚫ Inactive'}
                  </span>
                </div>

                {!monitoring ? (
                  <button
                    onClick={startMonitoring}
                    disabled={loading}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? 'Starting...' : '🚀 Start Monitoring'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 text-sm font-medium">✅ Monitoring Active</p>
                      <p className="text-green-600 text-xs mt-1">
                        Scanning for anomalies every 5 minutes
                      </p>
                    </div>
                    <button
                      onClick={checkStatus}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      🔄 Refresh Status
                    </button>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Monitoring Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Duplicate QR detection</li>
                    <li>• Time anomaly alerts</li>
                    <li>• Image integrity checks</li>
                    <li>• Batch mismatch detection</li>
                    <li>• Real-time notifications</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card title="Alert Statistics" className="mt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">🟢 Safe</span>
                  <span className="font-medium">{alerts.filter(a => a.level === 'Safe').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">🟡 Warning</span>
                  <span className="font-medium">{alerts.filter(a => a.level === 'Warning').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">🔴 Critical</span>
                  <span className="font-medium">{alerts.filter(a => a.level === 'Critical').length}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-2">
            <Card title="Recent Alerts">
              {!monitoring ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Monitoring Inactive</h3>
                  <p className="text-gray-600">Start monitoring to see real-time alerts</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">✅</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear</h3>
                  <p className="text-gray-600">No alerts detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-4 ${
                        alert.level === 'Critical' ? 'border-red-200 bg-red-50' :
                        alert.level === 'Warning' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{getAlertIcon(alert.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900">
                              {getAlertTitle(alert.type)}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlertColor(alert.level)}`}>
                              {alert.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                          <p className="text-xs text-gray-500 mb-2">{alert.details}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchdogMonitor;