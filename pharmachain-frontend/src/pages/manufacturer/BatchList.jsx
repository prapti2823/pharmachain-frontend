import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';
import { manufacturerAPI } from '../../utils/api';
import { formatDate, truncateHash } from '../../utils/formatters';

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const manufacturer = 'Default Manufacturer';

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await manufacturerAPI.getBatches();
      setBatches(response.data.batches || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setError('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'medicine_name',
      header: 'Medicine Name',
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'batch_number',
      header: 'Batch Number',
      render: (value) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{value}</span>
      )
    },
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
      key: 'ai_validation_status',
      header: 'AI Status',
      render: (value, row) => {
        const status = row.ai_validation?.status || 'pending';
        const getStatusColor = () => {
          switch (status) {
            case 'valid': return 'text-green-600 bg-green-100';
            case 'invalid': return 'text-red-600 bg-red-100';
            default: return 'text-yellow-600 bg-yellow-100';
          }
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {status === 'valid' ? '✅ Valid' : status === 'invalid' ? '❌ Invalid' : '⏳ Pending'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/manufacturer/batch/${row.medicine_id}`);
          }}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View Details →
        </button>
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/manufacturer')}
              className="text-blue-600 hover:text-blue-700 mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Medicine Batches</h1>
            <p className="text-gray-600">Manufacturer: {manufacturer}</p>
          </div>
          <button
            onClick={() => navigate('/manufacturer/register-batch')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Register New Batch
          </button>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        <Card>
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
                onRowClick={(batch) => navigate(`/manufacturer/batch/${batch.medicine_id}`)}
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
        </Card>
      </div>
    </div>
  );
};

export default BatchList;