import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';
import MedicineSearch from '../../components/MedicineSearch';
import { manufacturerAPI } from '../../utils/api';
import { formatDate, truncateHash } from '../../utils/formatters';

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [regeneratingQR, setRegeneratingQR] = useState(null);
  const [filterManufacturer, setFilterManufacturer] = useState('');
  const navigate = useNavigate();
  const manufacturer = 'Default Manufacturer';

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await manufacturerAPI.getBatches(filterManufacturer);
      setBatches(response.data.batches || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setError('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = async (medicineId, medicineName) => {
    setRegeneratingQR(medicineId);
    try {
      const response = await manufacturerAPI.regenerateQR(medicineId);
      if (response.data.qr_code_base64) {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${response.data.qr_code_base64}`;
        link.download = `QR_${medicineName}_${medicineId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSuccess('QR code downloaded successfully!');
      }
    } catch (error) {
      setError('Failed to download QR code');
    } finally {
      setRegeneratingQR(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Medicine Name',
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    // {
    //   key: 'batch_number',
    //   header: 'Batch Number',
    //   render: (value) => (
    //     <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{value}</span>
    //   )
    // },
    {
      key: 'expiry_date',
      header: 'Expiry Date',
      render: (value) => formatDate(value)
    },
    {
      key: 'quantity_manufactured',
      header: 'Quantity',
      render: (value) => `${value} units`
    },
    {
      key: 'blockchain_hash',
      header: 'Blockchain Hash',
      render: (value) => (
        <span className="font-mono text-xs text-gray-600">
          {truncateHash(value)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, row) => (
        <div className="flex gap-2">
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/manufacturer/batch/${row.id || row.medicine_id}`);
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50"
          >
            View
          </button> */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadQR(row.id || row.medicine_id, row.name || row.medicine_name);
            }}
            disabled={regeneratingQR === (row.id || row.medicine_id)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 disabled:opacity-50 flex items-center gap-1"
          >
            {regeneratingQR === (row.id || row.medicine_id) ? (
              '...'
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                QR
              </>
            )}
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader size="lg" text="Loading batches..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Medicine Batches</h1>
              <p className="text-slate-600">Manage and monitor your registered medicine batches</p>
            </div>
            <button
              onClick={() => navigate('/manufacturer/register-batch')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Register New Batch
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Filter Batches</h3>
                <button
                  onClick={fetchBatches}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
              <input
                type="text"
                value={filterManufacturer}
                onChange={(e) => setFilterManufacturer(e.target.value)}
                placeholder="Filter by manufacturer name..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div>
            <MedicineSearch onMedicineSelect={(medicine) => {
              setFilterManufacturer(medicine.manufacturer);
              fetchBatches();
            }} />
          </div>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}
        
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {batches.length > 0 ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Total batches: {batches.length}
                </p>
                <button
                  onClick={fetchBatches}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  🔄 Refresh
                </button>
              </div>
              <Table
                columns={columns}
                data={batches}
                onRowClick={(batch) => navigate(`/manufacturer/batch/${batch.id || batch.medicine_id}`)}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No batches registered</h3>
              <p className="text-gray-600 mb-6">Start by registering your first medicine batch</p>
              <button
                onClick={() => navigate('/manufacturer/register-batch')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register First Batch
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchList;