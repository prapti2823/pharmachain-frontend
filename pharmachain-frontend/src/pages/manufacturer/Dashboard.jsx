import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { manufacturerAPI, watchdogAPI } from '../../utils/api';

const ManufacturerDashboard = () => {
  const [stats, setStats] = useState({
    totalBatches: 0,
    validBatches: 0,
    pendingBatches: 0,
    watchdogActive: false
  });
  const [recentBatches, setRecentBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const manufacturer = 'Default Manufacturer'; // No login required

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch batches
      const batchesResponse = await manufacturerAPI.getBatches();
      const batches = batchesResponse.data.batches || [];
      
      // Calculate stats
      const validBatches = batches.filter(b => b.ai_validation?.status === 'valid').length;
      const pendingBatches = batches.filter(b => !b.ai_validation?.status || b.ai_validation?.status === 'pending').length;
      
      setStats({
        totalBatches: batches.length,
        validBatches,
        pendingBatches,
        watchdogActive: false
      });
      
      // Get recent batches (last 5)
      setRecentBatches(batches.slice(0, 5));
      
      // Check watchdog status
      try {
        const watchdogResponse = await watchdogAPI.getStatus();
        setStats(prev => ({
          ...prev,
          watchdogActive: watchdogResponse.data.monitoring
        }));
      } catch (error) {
        console.log('Watchdog not available');
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🏭 Manufacturer Dashboard</h1>
              <p className="text-gray-600">{manufacturer}</p>
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
              <div className="text-3xl font-bold text-blue-600">{stats.totalBatches}</div>
              <p className="text-sm text-gray-600 mt-1">Total Batches</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.validBatches}</div>
              <p className="text-sm text-gray-600 mt-1">Valid Batches</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingBatches}</div>
              <p className="text-sm text-gray-600 mt-1">Pending Validation</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className={`text-3xl font-bold ${stats.watchdogActive ? 'text-green-600' : 'text-gray-400'}`}>
                {stats.watchdogActive ? '🟢' : '⚫'}
              </div>
              <p className="text-sm text-gray-600 mt-1">Watchdog Status</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => navigate('/manufacturer/register-batch')}
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <div className="text-3xl mb-2">📦</div>
            <div className="font-medium">Register New Batch</div>
            <div className="text-sm opacity-90">Add medicine to blockchain</div>
          </button>
          
          <button
            onClick={() => navigate('/manufacturer/batches')}
            className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <div className="text-3xl mb-2">📋</div>
            <div className="font-medium">View All Batches</div>
            <div className="text-sm opacity-90">Manage your inventory</div>
          </button>
          
          <button
            onClick={() => navigate('/manufacturer/watchdog')}
            className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-medium">Watchdog Monitor</div>
            <div className="text-sm opacity-90">AI fraud detection</div>
          </button>
          
          <button
            onClick={fetchDashboardData}
            className="bg-gray-600 text-white p-6 rounded-lg hover:bg-gray-700 transition-colors text-center"
          >
            <div className="text-3xl mb-2">🔄</div>
            <div className="font-medium">Refresh Data</div>
            <div className="text-sm opacity-90">Update dashboard</div>
          </button>
        </div>

        {/* Recent Batches */}
        <Card title="Recent Batches">
          {recentBatches.length > 0 ? (
            <div className="space-y-4">
              {recentBatches.map((batch, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/manufacturer/batch/${batch.medicine_id}`)}
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{batch.medicine_name}</h4>
                    <p className="text-sm text-gray-600">Batch: {batch.batch_number}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      batch.ai_validation?.status === 'valid' 
                        ? 'text-green-600 bg-green-100' 
                        : 'text-yellow-600 bg-yellow-100'
                    }`}>
                      {batch.ai_validation?.status === 'valid' ? '✅ Valid' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <button
                  onClick={() => navigate('/manufacturer/batches')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All Batches →
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <p className="text-gray-600">No batches registered yet</p>
              <button
                onClick={() => navigate('/manufacturer/register-batch')}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register First Batch
              </button>
            </div>
          )}
        </Card>

        {/* System Status */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card title="System Status">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Blockchain Connection</span>
                <span className="text-green-600">🟢 Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">AI Validation Service</span>
                <span className="text-green-600">🟢 Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">QR Generation</span>
                <span className="text-green-600">🟢 Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Watchdog Monitor</span>
                <span className={stats.watchdogActive ? 'text-green-600' : 'text-gray-600'}>
                  {stats.watchdogActive ? '🟢 Active' : '⚫ Inactive'}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Quick Tips">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">💡</span>
                <span>Always upload clear, high-quality images of medicine packages</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">💡</span>
                <span>Enable watchdog monitoring to detect fraud attempts</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">💡</span>
                <span>Print QR codes on tamper-proof labels for best security</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">💡</span>
                <span>Regularly check batch verification status</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;