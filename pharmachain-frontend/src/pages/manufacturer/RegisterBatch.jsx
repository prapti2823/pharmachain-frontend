import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/ImageUploader';
import { manufacturerAPI } from '../../utils/api';
import { validateBatchForm } from '../../utils/validators';

const RegisterBatch = () => {
  const [formData, setFormData] = useState({
    medicine_name: '',
    manufacturer: 'PharmaCore Industries',
    batch_number: '',
    expiry_date: '',
    ingredients: '',
    usage: '',
    storage: '',
    quantity_manufactured: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrors({});

    const validation = validateBatchForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    if (!image) {
      setErrors({ image: 'Medicine image is required' });
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      submitData.append('image', image);

      const response = await manufacturerAPI.registerBatch(submitData);
      setResult(response.data);
    } catch (error) {
      console.error('Registration error:', error);
      setResult({
        status: 'error',
        message: error.response?.data?.detail || 'Registration failed'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Batch</h3>
          <p className="text-gray-600">AI is validating your medicine batch...</p>
        </div>
      </div>
    );
  }

  if (result && result.status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Batch Registration Success</h1>
              <button
                onClick={() => navigate('/manufacturer')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-green-600 mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h2 className="text-lg font-semibold text-green-900">Batch Successfully Registered!</h2>
                <p className="text-green-700">AI validation passed. Your medicine batch is now secured on the blockchain.</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Medicine:</span>
                  <span className="font-medium">{formData.medicine_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Batch Number:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{formData.batch_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{formData.quantity_manufactured} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span className="font-medium">{formData.expiry_date}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blockchain Hash:</span>
                  </div>
                  <span className="font-mono text-xs text-gray-500 break-all">
                    {result.batch_registration?.blockchain_hash}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
              <div className="text-center">
                {result.batch_registration?.qr_code_base64 && (
                  <div>
                    <img
                      src={`data:image/png;base64,${result.batch_registration.qr_code_base64}`}
                      alt="QR Code"
                      className="mx-auto border rounded-lg shadow-sm mb-4"
                    />
                    <p className="text-sm text-gray-600 mb-4">
                      Print this QR code and attach to medicine packages
                    </p>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = `qr-${formData.batch_number}.png`;
                        link.href = `data:image/png;base64,${result.batch_registration.qr_code_base64}`;
                        link.click();
                      }}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Download QR Code
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => {
                setResult(null);
                setFormData({
                  medicine_name: '',
                  manufacturer: 'PharmaCore Industries',
                  batch_number: '',
                  expiry_date: '',
                  ingredients: '',
                  usage: '',
                  storage: '',
                  quantity_manufactured: ''
                });
                setImage(null);
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Register Another Batch
            </button>
            <button
              onClick={() => navigate('/manufacturer/batches')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              View All Batches
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/manufacturer')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Register Medicine Batch</h1>
                <p className="text-sm text-gray-500">Add new medicine batch with AI validation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI Ready</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {result && result.status === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                <p className="text-sm text-red-700">{result.message}</p>
              </div>
              <button
                onClick={() => setResult(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  name="medicine_name"
                  value={formData.medicine_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.medicine_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Paracetamol 500mg"
                />
                {errors.medicine_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.medicine_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.manufacturer ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.manufacturer && (
                  <p className="text-red-500 text-sm mt-1">{errors.manufacturer}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Number *
                </label>
                <input
                  type="text"
                  name="batch_number"
                  value={formData.batch_number}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.batch_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., PAR2024001"
                />
                {errors.batch_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.batch_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.expiry_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expiry_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiry_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Manufactured *
                </label>
                <input
                  type="number"
                  name="quantity_manufactured"
                  value={formData.quantity_manufactured}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.quantity_manufactured ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 1000"
                />
                {errors.quantity_manufactured && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity_manufactured}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Conditions
                </label>
                <input
                  type="text"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Store below 25°C"
                />
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Detailed Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredients *
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.ingredients ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Paracetamol, Starch, Magnesium Stearate"
                />
                {errors.ingredients && (
                  <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Instructions
                </label>
                <textarea
                  name="usage"
                  value={formData.usage}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Take 1-2 tablets every 4-6 hours as needed"
                />
              </div>
            </div>
          </div>

          {/* Medicine Image */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Medicine Package Image</h2>
            <ImageUploader
              onImageSelect={setImage}
              label="Upload clear image of medicine package *"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-2">{errors.image}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11.207 8.5a1 1 0 00-1.414-1.414L6.586 10.293a.5.5 0 00-.146.353V13a1 1 0 001 1h2.354a.5.5 0 00.353-.146l2.06-2.061z" clipRule="evenodd" />
              </svg>
              <span>Register Batch with AI Validation</span>
            </button>
            <p className="text-sm text-gray-500 mt-3">
              AI will validate your batch and generate blockchain-secured QR code
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterBatch;