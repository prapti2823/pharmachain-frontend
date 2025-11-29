import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import Loader from '../../components/Loader';
import { watchdogAPI, medicineAPI, aiAPI } from '../../utils/api';

const WatchdogMonitor = () => {
  const [monitoring, setMonitoring] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scanHistory, setScanHistory] = useState([]);
  const [lastScan, setLastScan] = useState(null);
  const [agentStatus, setAgentStatus] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkWatchdogStatus();
    fetchScanHistory();
    fetchAgentStatus();
    
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(() => {
      if (monitoring) {
        fetchScanHistory();
        fetchAgentStatus();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [monitoring]);

  const checkWatchdogStatus = async () => {
    try {
      const response = await watchdogAPI.getStatus();
      setMonitoring(response.data.monitoring || false);
    } catch (error) {
      console.error('Error checking watchdog status:', error);
      setError('Failed to check watchdog status');
    } finally {
      setLoading(false);
    }
  };

  const fetchScanHistory = async () => {
    try {
      const response = await medicineAPI.getScans();
      const scans = response.data.scans || response.data || [];
      setScanHistory(scans);
      
      // Set the most recent scan as last scan
      if (scans.length > 0) {
        const sortedScans = scans.sort((a, b) => {
          const timeA = new Date(a.timestamp || a.created_at || Date.now());
          const timeB = new Date(b.timestamp || b.created_at || Date.now());
          return timeB - timeA;
        });
        setLastScan(sortedScans[0]);
      }
    } catch (error) {
      console.error('Error fetching scan history:', error);
      // If scans API fails, try to get individual scan details
      try {
        const scanDetailsResponse = await medicineAPI.getScanDetails('latest');
        if (scanDetailsResponse.data) {
          setLastScan(scanDetailsResponse.data);
          setScanHistory([scanDetailsResponse.data]);
        }
      } catch (detailError) {
        console.error('Error fetching scan details:', detailError);
      }
    }
  };

  const fetchAgentStatus = async () => {
    try {
      const response = await aiAPI.getAgentStatus();
      setAgentStatus(response.data);
    } catch (error) {
      console.error('Error fetching agent status:', error);
    }
  };

  const startMonitoring = async () => {
    try {
      setLoading(true);
      
      // Try to start monitoring with potential parameters
      let response;
      try {
        response = await watchdogAPI.startMonitoring();
      } catch (error) {
        // If it fails, try with empty body or different format
        if (error.response?.status === 422 || error.response?.status === 400) {
          response = await watchdogAPI.startMonitoring({});
        } else {
          throw error;
        }
      }
      
      setMonitoring(true);
      setSuccess('AI Watchdog monitoring started successfully');
      setError('');
      
      // Fetch initial data
      await fetchScanHistory();
      await fetchAgentStatus();
    } catch (error) {
      console.error('Error starting monitoring:', error);
      setError(`Failed to start watchdog monitoring: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getScanStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'authentic':
      case 'accept':
        return 'text-emerald-700 bg-emerald-100';
      case 'suspicious':
      case 'review':
        return 'text-amber-700 bg-amber-100';
      case 'rejected':
      case 'counterfeit':
      case 'reject':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-slate-700 bg-slate-100';
    }
  };

  const getScanIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'authentic':
      case 'accept':
        return '✅';
      case 'suspicious':
      case 'review':
        return '⚠️';
      case 'rejected':
      case 'counterfeit':
      case 'reject':
        return '❌';
      default:
        return '🔍';
    }
  };

  const getAlertLevel = (scan) => {
    // Check status first, then trust score
    const status = scan.status?.toLowerCase() || scan.result?.toLowerCase() || scan.ai_decision?.toLowerCase();
    
    if (status === 'verified' || status === 'authentic' || status === 'valid' || status === 'accept') {
      return 'Safe';
    }
    if (status === 'rejected' || status === 'counterfeit' || status === 'invalid' || status === 'reject') {
      return 'Critical';
    }
    if (status === 'review' || status === 'pending' || status === 'suspicious') {
      return 'Warning';
    }
    
    // Fallback to trust score
    const trustScore = scan.trust_score || scan.confidence || 0;
    if (trustScore >= 80) return 'Safe';
    if (trustScore >= 60) return 'Warning';
    return 'Critical';
  };

  const getAlertLevelColor = (level) => {
    switch (level) {
      case 'Safe': return 'text-emerald-600 bg-emerald-100';
      case 'Warning': return 'text-amber-600 bg-amber-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/manufacturer')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">AI Watchdog Monitor</h1>
              <p className="text-slate-600">Real-time fraud detection and security monitoring</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}
        
        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess('')} />
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Monitoring Control
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    monitoring ? 'text-emerald-700 bg-emerald-100' : 'text-slate-600 bg-slate-100'
                  }`}>
                    {monitoring ? '🟢 Active' : '⚫ Inactive'}
                  </span>
                </div>

                {!monitoring ? (
                  <button
                    onClick={startMonitoring}
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader size="sm" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 013-3h4a3 3 0 013 3v2M7 21h10a2 2 0 002-2v-5a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2z" />
                        </svg>
                        Start Monitoring
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <p className="text-emerald-800 text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Monitoring Active
                      </p>
                      <p className="text-emerald-600 text-xs mt-1">
                        Real-time scanning and analysis
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        checkWatchdogStatus();
                        fetchScanHistory();
                        fetchAgentStatus();
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh Data
                    </button>
                  </div>
                )}

                {/* Last Scan Info */}
                {lastScan && (
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="font-medium text-slate-900 mb-3">Last Scan:</h4>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getScanIcon(lastScan.status || lastScan.result)}</span>
                        <span className="font-medium text-slate-800">
                          {lastScan.medicine_name || 'Medicine Scan'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div>Status: <span className="font-medium">{lastScan.status || lastScan.result || 'Unknown'}</span></div>
                        <div>Trust: <span className="font-medium">{lastScan.trust_score || lastScan.confidence || 'N/A'}%</span></div>
                        <div>Time: <span className="font-medium">
                          {lastScan.timestamp ? new Date(lastScan.timestamp).toLocaleString() : 'Recent'}
                        </span></div>
                      </div>
                    </div>
                  </div>
                )}

                {agentStatus && (
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="font-medium text-slate-900 mb-3">AI Agent Status:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <span className={`font-medium ${agentStatus.active ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {agentStatus.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {agentStatus.last_activity && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Last Activity:</span>
                          <span className="text-slate-800 font-medium">
                            {new Date(agentStatus.last_activity).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
                Scan Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    Safe
                  </span>
                  <span className="font-semibold text-slate-800">
                    {scanHistory.filter(s => getAlertLevel(s) === 'Safe').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    Warning
                  </span>
                  <span className="font-semibold text-slate-800">
                    {scanHistory.filter(s => getAlertLevel(s) === 'Warning').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Critical
                  </span>
                  <span className="font-semibold text-slate-800">
                    {scanHistory.filter(s => getAlertLevel(s) === 'Critical').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scan History Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.829 2.829A4 4 0 019.071 11H13l-4-4H4.828zM4.828 7L2 4.172A1 1 0 012.828 3h5.657L12 6.515 19.071 13.5" />
                </svg>
                Recent Scan Activity
                <span className="ml-auto text-sm text-slate-500">
                  {scanHistory.length} total scans
                </span>
              </h3>
              
              {!monitoring ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Monitoring Inactive</h3>
                  <p className="text-slate-600">Start monitoring to see real-time scan activity</p>
                </div>
              ) : scanHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Scans Yet</h3>
                  <p className="text-slate-600">Waiting for medicine verification scans...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {scanHistory.length > 0 ? scanHistory.slice(0, 20).map((scan, index) => {
                    const alertLevel = getAlertLevel(scan);
                    return (
                      <div
                        key={scan.scan_id || index}
                        className={`border rounded-xl p-4 transition-all duration-200 ${
                          alertLevel === 'Critical' ? 'border-red-200 bg-red-50' :
                          alertLevel === 'Warning' ? 'border-amber-200 bg-amber-50' :
                          'border-emerald-200 bg-emerald-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${
                            alertLevel === 'Critical' ? 'bg-red-100' :
                            alertLevel === 'Warning' ? 'bg-amber-100' :
                            'bg-emerald-100'
                          }`}>
                            <span className="text-xl">{getScanIcon(scan.status || scan.result)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-slate-900">
                                {scan.medicine_name || `Medicine Scan #${scan.scan_id || index + 1}`}
                              </h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAlertLevelColor(alertLevel)}`}>
                                {alertLevel}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                              <div>
                                <span className="text-slate-600">Status:</span>
                                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getScanStatusColor(scan.status || scan.result)}`}>
                                  {scan.status || scan.result || 'Unknown'}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-600">Trust Score:</span>
                                <span className="ml-2 font-medium text-slate-800">
                                  {scan.trust_score || scan.confidence || 'N/A'}%
                                </span>
                              </div>
                              {scan.batch_number && (
                                <div>
                                  <span className="text-slate-600">Batch:</span>
                                  <span className="ml-2 font-mono text-slate-800">{scan.batch_number}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-slate-600">Time:</span>
                                <span className="ml-2 text-slate-800">
                                  {scan.timestamp ? new Date(scan.timestamp).toLocaleTimeString() : 'Recent'}
                                </span>
                              </div>
                            </div>
                            {scan.ai_analysis && (
                              <p className="text-xs text-slate-600 mt-2">{scan.ai_analysis}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-8">
                      <div className="p-4 bg-amber-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Loading Scan Data</h3>
                      <p className="text-slate-600">Fetching recent scan activity...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchdogMonitor;