import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { manufacturerAPI, watchdogAPI, medicineAPI } from '../../utils/api';

const ManufacturerDashboard = () => {
  // const [stats, setStats] = useState({
  //   totalBatches: 0,
  //   validBatches: 0,
  //   pendingBatches: 0,
  //   watchdogActive: false
  // });
  const [recentBatches, setRecentBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manufacturer, setManufacturer] = useState('');
  const [manufacturerId, setManufacturerId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if manufacturer is logged in
    const storedManufacturer = localStorage.getItem('manufacturerName');
    const storedManufacturerId = localStorage.getItem('manufacturerId');
    
    if (!storedManufacturer || !storedManufacturerId) {
      navigate('/manufacturer/login');
      return;
    }
    
    setManufacturer(storedManufacturer);
    setManufacturerId(storedManufacturerId);
    fetchDashboardData(storedManufacturerId);
  }, [navigate]);

  const fetchDashboardData = async (manufacturerId) => {
    try {
      setLoading(true);
      
      // Fetch batches for specific manufacturer
      const batchesResponse = await manufacturerAPI.getBatches(manufacturerId);
      const batches = batchesResponse.data.batches || [];
      
      // Fetch watchdog status
      let watchdogActive = false;
      try {
        const watchdogResponse = await watchdogAPI.getStatus();
        watchdogActive = watchdogResponse.data.monitoring || false;
      } catch (error) {
        console.log('Watchdog not available');
      }
      
      // Calculate stats with multiple status formats
      const validBatches = batches.filter(b => {
        const aiStatus = b.ai_validation?.status?.toLowerCase();
        const status = b.status?.toLowerCase();
        return aiStatus === 'valid' || aiStatus === 'approved' || aiStatus === 'validated' ||
               status === 'valid' || status === 'approved' || status === 'validated' || status === 'active';
      }).length;
      
      const pendingBatches = batches.filter(b => {
        const aiStatus = b.ai_validation?.status?.toLowerCase();
        const status = b.status?.toLowerCase();
        return aiStatus === 'pending' || aiStatus === 'processing' ||
               status === 'pending' || status === 'processing' || status === 'review';
      }).length;
      
      // setStats({
      //   totalBatches: batches.length,
      //   validBatches,
      //   pendingBatches,
      //   watchdogActive
      // });
      
      // Set recent batches (last 5)
      setRecentBatches(batches.slice(-5).reverse());
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('manufacturerName');
    localStorage.removeItem('manufacturerId');
    localStorage.removeItem('manufacturerData');
    navigate('/manufacturer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Manufacturer Portal</h1>
                <p className="text-slate-600 font-medium">{manufacturer}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
              <button
                onClick={goHome}
                className="flex items-center space-x-2 px-4 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-blue-100 text-lg">Manage your medicine batches with AI-powered security</p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Batches</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalBatches}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">Total registered</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">AI Validated</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.validBatches}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{stats.totalBatches > 0 ? Math.round((stats.validBatches / stats.totalBatches) * 100) : 0}% success rate</p>
              </div>
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pendingBatches}</p>
                <p className="text-xs text-amber-600 font-medium mt-1">Awaiting validation</p>
              </div>
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">AI Watchdog</p>
                <p className={`text-3xl font-bold ${stats.watchdogActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {stats.watchdogActive ? 'Active' : 'Inactive'}
                </p>
                <p className="text-xs text-emerald-600 font-medium mt-1">Real-time monitoring</p>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stats.watchdogActive ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                <svg className={`w-7 h-7 ${stats.watchdogActive ? 'text-emerald-600' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11.207 8.5a1 1 0 00-1.414-1.414L6.586 10.293a.5.5 0 00-.146.353V13a1 1 0 001 1h2.354a.5.5 0 00.353-.146l2.06-2.061z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div> */}

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/manufacturer/register-batch')}
              className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Register New Batch</h4>
              <p className="text-sm text-slate-600">Add medicine batch with AI validation</p>
            </button>

            <button
              onClick={() => navigate('/manufacturer/batches')}
              className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <svg className="w-7 h-7 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Manage Batches</h4>
              <p className="text-sm text-slate-600">View and manage all batches</p>
            </button>

            <button
              onClick={() => navigate('/manufacturer/watchdog')}
              className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">AI Watchdog</h4>
              <p className="text-sm text-slate-600">Monitor fraud detection system</p>
            </button>

            {/* <button
              onClick={() => window.location.reload()}
              className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                <svg className="w-7 h-7 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Refresh Data</h4>
              <p className="text-sm text-slate-600">Update dashboard information</p>
            </button> */}
          </div>
        </div>

        {/* Recent Activity */}
        {/* <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>
          </div>
          <div className="p-6">
            {recentBatches.length > 0 ? (
              <div className="space-y-4">
                {recentBatches.map((batch, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{batch.medicine_name}</h4>
                        <p className="text-sm text-slate-600">Batch: {batch.batch_number}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                      ✅ Validated
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">No batches registered yet</h4>
                <p className="text-slate-600 mb-6">Start by registering your first medicine batch with AI validation</p>
                <button
                  onClick={() => navigate('/manufacturer/register-batch')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Register First Batch
                </button>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;