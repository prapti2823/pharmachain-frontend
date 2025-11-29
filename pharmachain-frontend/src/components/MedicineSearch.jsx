import { useState } from 'react';
import { medicineAPI } from '../utils/api';
import Loader from './Loader';

const MedicineSearch = ({ onMedicineSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await medicineAPI.getAll();
      const allMedicines = response.data.medicines || response.data || [];
      
      // Filter medicines by search term
      const filtered = allMedicines.filter(medicine => 
        medicine.medicine_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.batch_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setResults(filtered.slice(0, 10)); // Limit to 10 results
    } catch (err) {
      setError('Failed to search medicines');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-slate-800">Search Medicines</h3>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter medicine name..."
          className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !searchTerm.trim()}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? <Loader size="sm" /> : 'Search'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-slate-700 mb-3">Search Results:</h4>
          {results.map((medicine, index) => (
            <div
              key={index}
              onClick={() => onMedicineSelect && onMedicineSelect(medicine)}
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-slate-800">{medicine.medicine_name}</h5>
                  <p className="text-sm text-slate-600">Manufacturer: {medicine.manufacturer}</p>
                  <p className="text-sm text-slate-600">Batch: {medicine.batch_number}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && searchTerm && !loading && (
        <div className="text-center py-8 text-slate-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
          <p>No medicines found for "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default MedicineSearch;