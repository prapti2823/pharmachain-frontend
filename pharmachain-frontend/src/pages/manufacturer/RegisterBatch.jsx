import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/ImageUploader';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';
import { manufacturerAPI } from '../../utils/api';

const RegisterBatch = () => {
  const [formData, setFormData] = useState({
    medicine_name: '',
    manufacturer_id: localStorage.getItem('manufacturerId') || '',
    batch_number: '',
    expiry_date: '',
    ingredients: '',
    usage: '',
    storage: '',
    quantity_manufactured: ''
  });
  const [manufacturerName, setManufacturerName] = useState(localStorage.getItem('manufacturerName') || '');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.medicine_name.trim()) errors.medicine_name = 'Medicine name is required';
    if (!formData.batch_number.trim()) errors.batch_number = 'Batch number is required';
    if (!formData.expiry_date) errors.expiry_date = 'Expiry date is required';
    if (!formData.ingredients.trim()) errors.ingredients = 'Ingredients are required';
    if (!formData.usage.trim()) errors.usage = 'Usage information is required';
    if (!formData.storage.trim()) errors.storage = 'Storage instructions are required';
    if (!formData.quantity_manufactured) errors.quantity_manufactured = 'Quantity is required';
    if (!formData.manufacturer_id) errors.manufacturer_id = 'Manufacturer ID is required';
    if (!image) errors.image = 'Medicine package image is required';

    // Validate expiry date is in future
    if (formData.expiry_date && new Date(formData.expiry_date) <= new Date()) {
      errors.expiry_date = 'Expiry date must be in the future';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      submitData.append('image', image);

      const response = await manufacturerAPI.registerBatch(submitData);
      
      if (response.data.status === 'success') {
        setSuccess(true);
        setQrCode(response.data.batch_registration.qr_code_base64);
      } else {
        setError('Registration failed: ' + (response.data.detail?.errors?.join(', ') || 'Unknown error'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to register batch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${qrCode}`;
    link.download = `QR_${formData.medicine_name}_${formData.batch_number}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Batch Registered Successfully!</h2>
              <p className="text-emerald-100">AI validation completed with 100% confidence</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{formData.medicine_name}</h3>
                <p className="text-slate-600">Batch: {formData.batch_number}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-slate-800 mb-4 text-center">QR Code for Package</h4>
                <div className="flex justify-center mb-4">
                  <img 
                    src={`data:image/png;base64,${qrCode}`} 
                    alt="QR Code"
                    className="w-48 h-48 border border-slate-200 rounded-lg shadow-sm"
                  />
                </div>
                <p className="text-sm text-slate-600 text-center mb-4">
                  Download this QR code and attach it to your medicine packages
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download QR Code
                </button>
                <button
                  onClick={() => navigate('/manufacturer/batches')}
                  className="flex-1 bg-slate-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                >
                  View All Batches
                </button>
              </div>

              <button
                onClick={() => {
                  setSuccess(false);
                  setFormData({
                    medicine_name: '',
                    manufacturer_id: 1,
                    batch_number: '',
                    expiry_date: '',
                    ingredients: '',
                    usage: '',
                    storage: '',
                    quantity_manufactured: ''
                  });
                  setImage(null);
                  setQrCode('');
                }}
                className="w-full mt-3 text-slate-600 hover:text-slate-800 py-2 font-medium transition-colors"
              >
                Register Another Batch
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => navigate('/manufacturer')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Register Medicine Batch</h1>
            <p className="text-slate-600">Add new medicine batch with AI validation and blockchain security</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    name="medicine_name"
                    value={formData.medicine_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.medicine_name ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="e.g., Paracetamol 500mg"
                  />
                  {validationErrors.medicine_name && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.medicine_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={manufacturerName}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Batch Number *
                    </label>
                    <input
                      type="text"
                      name="batch_number"
                      value={formData.batch_number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        validationErrors.batch_number ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="PAR2024001"
                    />
                    {validationErrors.batch_number && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.batch_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity_manufactured"
                      value={formData.quantity_manufactured}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        validationErrors.quantity_manufactured ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="1000"
                    />
                    {validationErrors.quantity_manufactured && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.quantity_manufactured}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.expiry_date ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                  {validationErrors.expiry_date && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.expiry_date}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Detailed Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ingredients *
                  </label>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      validationErrors.ingredients ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="List all active and inactive ingredients"
                  />
                  {validationErrors.ingredients && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.ingredients}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Usage Instructions *
                  </label>
                  <textarea
                    name="usage"
                    value={formData.usage}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      validationErrors.usage ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Dosage, frequency, and usage instructions"
                  />
                  {validationErrors.usage && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.usage}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Storage Instructions *
                  </label>
                  <textarea
                    name="storage"
                    value={formData.storage}
                    onChange={handleInputChange}
                    rows={2}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      validationErrors.storage ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Temperature, humidity, and storage conditions"
                  />
                  {validationErrors.storage && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.storage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Package Image *
            </h3>
            
            <ImageUploader
              onImageSelect={setImage}
              selectedImage={image}
              error={validationErrors.image}
            />
            {validationErrors.image && (
              <p className="text-red-600 text-sm mt-2">{validationErrors.image}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/manufacturer')}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size="sm" />
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Register Batch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterBatch;