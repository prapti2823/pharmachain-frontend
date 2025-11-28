import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

const ManufacturerLogin = () => {
  const [formData, setFormData] = useState({
    manufacturer: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.manufacturer || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Store manufacturer info in localStorage (simple auth)
    localStorage.setItem('manufacturer', formData.manufacturer);
    localStorage.setItem('userType', 'manufacturer');
    
    navigate('/manufacturer/dashboard');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🏭 PharmaChain</h1>
          <p className="mt-2 text-gray-600">Manufacturer Portal</p>
        </div>

        <Card title="Login to Your Account">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert type="error" message={error} />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer Name
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter manufacturer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/pharmacy/login')}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Switch to Pharmacy Portal →
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManufacturerLogin;