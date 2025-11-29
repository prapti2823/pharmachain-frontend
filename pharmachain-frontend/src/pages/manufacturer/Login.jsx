import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { manufacturerAPI } from '../../utils/api';
import Loader from '../../components/Loader';

const ManufacturerLogin = () => {
  const [manufacturerName, setManufacturerName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!manufacturerName.trim()) {
      setError('Please enter manufacturer name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await manufacturerAPI.getByName(manufacturerName.trim());
      
      if (response.data) {
        // Store manufacturer data in localStorage
        localStorage.setItem('manufacturerId', response.data.id);
        localStorage.setItem('manufacturerName', response.data.name);
        localStorage.setItem('manufacturerData', JSON.stringify(response.data));
        
        // Navigate to dashboard
        navigate('/manufacturer');
      } else {
        setError('Manufacturer not found. Please check the name.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Manufacturer Access</h2>
            <p className="text-blue-100">Enter your manufacturer details to continue</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Manufacturer Name *
                </label>
                <input
                  type="text"
                  value={manufacturerName}
                  onChange={(e) => {
                    setManufacturerName(e.target.value);
                    setError('');
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    error ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="e.g., PharmaCore Industries"
                />
                {error && (
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size="sm" />
                    Authenticating...
                  </>
                ) : (
                  'Access Manufacturer Portal'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => navigate('/')}
                className="w-full text-slate-600 hover:text-slate-800 py-2 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerLogin;