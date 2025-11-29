import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import Loader from '../../components/Loader';
import { watchdogAPI } from '../../utils/api';

const WatchdogMonitor = () => {
  const [monitoring, setMonitoring] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [lastScan, setLastScan] = useState(null);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkWatchdogStatus();
    fetchAlerts();
    
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(() => {
      if (monitoring) {
        checkWatchdogStatus();
        fetchAlerts();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [monitoring]);

  const checkWatchdogStatus = async () => {
    try {
      const response = await watchdogAPI.getStatus();
      setMonitoring(response.data.monitoring || false);
      setTotalAlerts(response.data.total_alerts || 0);
      setLastScan(response.data.last_scan || null);
    } catch (error) {
      console.error('Error checking watchdog status:', error);
      setError('Failed to check watchdog status');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await watchdogAPI.getAlerts();
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    }
  };

  const clearAlerts = async () => {
    try {
      await watchdogAPI.clearAlerts();
      setAlerts([]);
      setTotalAlerts(0);
      setSuccess('All alerts cleared successfully');
    } catch (error) {
      console.error('Error clearing alerts:', error);
      setError('Failed to clear alerts');
    }
  };

  const startMonitoring = async () => {
    try {
      setLoading(true);
      
      const response = await watchdogAPI.startMonitoring({});
      
      setMonitoring(true);
      setSuccess('AI Watchdog monitoring started successfully');
      setError('');
      
      // Fetch initial data
      await checkWatchdogStatus();
      await fetchAlerts();
    } catch (error) {
      console.error('Error starting monitoring:', error);
      setError(`Failed to start watchdog monitoring: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'low':
        return 'text-green-700 bg-green-100 border-green-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      case 'low':
        return 'ℹ️';
      default:
        return '🔍';
    }
  };

  const getAlertTypeIcon = (alertType) => {
    switch (alertType) {
      case 'duplicate_qrs':
        return '🔄';
      case 'image_missing':
        return '🖼️';
      case 'image_verification_failed':
        return '❌';
      case 'blockchain_monitoring_failed':
        return '⛓️';
      case 'quantity_mismatch':
        return '📊';
      case 'duplicate_blockchain_hash':
        return '🔗';
      case 'rapid_registrations':
        return '🤖';
      default:
        return '⚠️';
    }
  };

  if (loading && !monitoring) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" />
          <p className="text-slate-600 font-medium mt-4">Loading watchdog status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/manufacturer')}
              className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 transition-all duration-200 hover:translate-x-1"
            >
              <div className="p-1 rounded-lg group-hover:bg-indigo-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-75 animate-pulse"></div>
                  <div className="relative p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl">
                    <span className="text-3xl animate-bounce">🐕</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                    Watchdog AI Agent
                  </h1>
                  <p className="text-slate-600 text-lg font-medium">Enterprise Security & Fraud Detection System</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      monitoring ? 'bg-emerald-400' : 'bg-slate-400'
                    }`}></div>
                    <span className="text-sm font-medium text-slate-500">
                      {monitoring ? 'System Active' : 'System Standby'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{totalAlerts}</div>
                  <div className="text-xs text-slate-500 font-medium">Total Alerts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {alerts.filter(a => a.severity === 'critical').length}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {alerts.filter(a => a.severity === 'high').length}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">High Priority</div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 animate-slideDown">
              <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
          )}
          
          {success && (
            <div className="mb-6 animate-slideDown">
              <Alert type="success" message={success} onClose={() => setSuccess('')} />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">System Control</h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-700">System Status</span>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                        monitoring 
                          ? 'text-emerald-700 bg-emerald-100 border border-emerald-200' 
                          : 'text-slate-600 bg-slate-100 border border-slate-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          monitoring ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}></div>
                        {monitoring ? 'ACTIVE' : 'STANDBY'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-slate-800">{totalAlerts}</div>
                        <div className="text-xs text-slate-500 font-medium">Total Alerts</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-red-600">
                          {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">Priority</div>
                      </div>
                    </div>
                  </div>

                  {!monitoring ? (
                    <button
                      onClick={startMonitoring}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl font-bold disabled:opacity-50 flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Initializing System...
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          START MONITORING
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-4 shadow-inner">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                          <p className="text-emerald-800 font-bold text-sm">SYSTEM ACTIVE</p>
                        </div>
                        <p className="text-emerald-600 text-xs font-medium">
                          🛡️ Real-time monitoring & threat detection enabled
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            checkWatchdogStatus();
                            fetchAlerts();
                          }}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-xs font-bold flex items-center justify-center gap-1 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          REFRESH
                        </button>
                        
                        <button
                          onClick={clearAlerts}
                          className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 text-xs font-bold flex items-center justify-center gap-1 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          CLEAR
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Last Scan Info */}
                  {lastScan && (
                    <div className="border-t border-slate-200 pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-slate-900">Latest Scan</h4>
                      </div>
                      
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 shadow-inner">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-white rounded-lg p-2 shadow-sm">
                            <div className="text-slate-500 font-medium">Timestamp</div>
                            <div className="font-bold text-slate-800 text-[10px]">
                              {new Date(lastScan.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-2 shadow-sm">
                            <div className="text-slate-500 font-medium">Issues</div>
                            <div className="font-bold text-red-600">{lastScan.total_alerts || 0}</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 shadow-sm">
                            <div className="text-slate-500 font-medium">QR Issues</div>
                            <div className="font-bold text-slate-800">{lastScan.duplicate_qrs?.length || 0}</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 shadow-sm">
                            <div className="text-slate-500 font-medium">Image Issues</div>
                            <div className="font-bold text-slate-800">{lastScan.image_issues?.length || 0}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Alert Statistics */}
              
            </div>

            {/* Alerts Dashboard */}
            <div className="lg:col-span-2 grid grid-cols-2">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-xl">
                      <span className="text-2xl animate-pulse">🚨</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">Security Command Center</h3>
                      <p className="text-slate-600 font-medium">
                        {alerts.length} active alerts • Real-time monitoring
                      </p>
                    </div>
                  </div>
                  
                  {alerts.length > 0 && (
                    <button
                      onClick={clearAlerts}
                      className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl font-bold flex items-center gap-2 transform hover:scale-105 active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      CLEAR ALL ALERTS
                    </button>
                  )}
                </div>
              
                {!monitoring ? (
                  <div className="text-center py-16">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full blur opacity-50 animate-pulse"></div>
                      <div className="relative p-6 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-xl">
                        <span className="text-4xl">🐕</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">System Standby</h3>
                    <p className="text-slate-600 text-lg">Activate monitoring to begin real-time threat detection</p>
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-300 rounded-full blur opacity-50 animate-pulse"></div>
                      <div className="relative p-6 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-xl">
                        <span className="text-4xl">🛡️</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">All Systems Secure</h3>
                    <p className="text-slate-600 text-lg">No security threats detected • System operating normally</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {alerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${getSeverityColor(alert.severity)} animate-slideUp`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur opacity-50 animate-pulse"></div>
                            <div className={`relative p-4 rounded-2xl shadow-xl ${getSeverityColor(alert.severity)}`}>
                              <span className="text-2xl">{getAlertTypeIcon(alert.alert_type)}</span>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="font-bold text-slate-900 text-lg leading-tight">
                                {alert.message}
                              </h4>
                              <div className={`px-4 py-2 rounded-full text-xs font-black shadow-lg ${getSeverityColor(alert.severity)}`}>
                                {getSeverityIcon(alert.severity)} {alert.severity?.toUpperCase()}
                              </div>
                            </div>
                            
                            <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                  <div className="text-xs text-slate-500 font-medium mb-1">Alert Type</div>
                                  <div className="font-bold text-slate-800">{alert.alert_type}</div>
                                </div>
                                {alert.count && (
                                  <div className="text-center">
                                    <div className="text-xs text-slate-500 font-medium mb-1">Count</div>
                                    <div className="font-bold text-slate-800">{alert.count}</div>
                                  </div>
                                )}
                                <div className="text-center">
                                  <div className="text-xs text-slate-500 font-medium mb-1">Detected</div>
                                  <div className="font-bold text-slate-800 text-xs">
                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Threat Analytics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                        <span className="text-sm font-bold text-red-700">CRITICAL</span>
                      </div>
                      <span className="text-2xl font-black text-red-600">
                        {alerts.filter(a => a.severity === 'critical').length}
                      </span>
                    </div>
                    <div className="text-xs text-red-600 font-medium">Immediate Action Required</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-lg"></div>
                        <span className="text-sm font-bold text-orange-700">HIGH</span>
                      </div>
                      <span className="text-2xl font-black text-orange-600">
                        {alerts.filter(a => a.severity === 'high').length}
                      </span>
                    </div>
                    <div className="text-xs text-orange-600 font-medium">Priority Review</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg"></div>
                        <span className="text-sm font-bold text-amber-700">MEDIUM</span>
                      </div>
                      <span className="text-2xl font-black text-amber-600">
                        {alerts.filter(a => a.severity === 'medium').length}
                      </span>
                    </div>
                    <div className="text-xs text-amber-600 font-medium">Monitor Closely</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                        <span className="text-sm font-bold text-green-700">LOW</span>
                      </div>
                      <span className="text-2xl font-black text-green-600">
                        {alerts.filter(a => a.severity === 'low').length}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-medium">Informational</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchdogMonitor;