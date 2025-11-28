import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Loader from '../../components/Loader';
import ImageUploader from '../../components/ImageUploader';
import QRGenerator from '../../components/QRGenerator';
import { manufacturerAPI } from '../../utils/api';
import { validateBatchForm } from '../../utils/validators';

const RegisterBatch = () => {
  const [formData, setFormData] = useState({
    medicine_name: '',
    manufacturer: 'Default Manufacturer',
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
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrors({});

    // Validate form
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader size="lg" text="AI is validating your batch..." />
      </div>
    );
  }

  if (result && result.status === 'success') {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate('/manufacturer')}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Dashboard
            </button>
          </div>

          <Alert
            type="success"
            title="Batch Registered Successfully!"
            message="AI validation passed. Your medicine batch has been registered on the blockchain."
          />

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card title="Batch Details">
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Medicine:</span> {formData.medicine_name}
                </div>
                <div>
                  <span className="font-medium">Batch Number:</span> {formData.batch_number}
                </div>
                <div>
                  <span className="font-medium">Blockchain Hash:</span>
                  <span className="text-xs font-mono bg-gray-100 p-1 rounded block mt-1">
                    {result.batch_registration?.blockchain_hash}
                  </span>
                </div>
                <div>
                  <span className="font-medium">AI Validation:</span>
                  <span className="text-green-600 ml-2">✅ Passed</span>
                </div>
              </div>
            </Card>

            <Card title="QR Code for Printing">
              <div className="text-center">
                {result.batch_registration?.qr_code_base64 && (
                  <div>
                    <img
                      src={`data:image/png;base64,${result.batch_registration.qr_code_base64}`}
                      alt="QR Code"
                      className="mx-auto border rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Print this QR code and attach to medicine package
                    </p>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = `qr-${formData.batch_number}.png`;
                        link.href = `data:image/png;base64,${result.batch_registration.qr_code_base64}`;
                        link.click();
                      }}
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📥 Download QR Code
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setResult(null);
                setFormData({
                  medicine_name: '',
                  manufacturer: 'Default Manufacturer',
                  batch_number: '',
                  expiry_date: '',
                  ingredients: '',
                  usage: '',
                  storage: '',
                  quantity_manufactured: ''
                });
                setImage(null);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              Register Another Batch
            </button>
            <button
              onClick={() => navigate('/manufacturer/batches')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              View All Batches
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/manufacturer')}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </button>
        </div>

        <Card title="Register New Medicine Batch">
          {result && result.status === 'error' && (
            <Alert
              type="error"
              title="Registration Failed"
              message={result.message}
              onClose={() => setResult(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.manufacturer ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., ABC Pharma Ltd"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Store below 25°C"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients *
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Take 1-2 tablets every 4-6 hours as needed"
              />
            </div>

            <div>
              <ImageUploader
                onImageSelect={setImage}
                label="Medicine Package Image *"
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🤖 Register Batch (AI Validation)
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterBatch;