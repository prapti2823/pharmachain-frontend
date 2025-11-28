import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏭🏥 PharmaChain
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Blockchain-Powered Medicine Authentication System
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Secure your pharmaceutical supply chain with AI-powered verification, 
            blockchain technology, and real-time fraud detection.
          </p>
        </div>

        {/* Portal Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
            <div 
              className="text-center p-8"
              onClick={() => navigate('/manufacturer')}
            >
              <div className="text-6xl mb-6">🏭</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Manufacturer Portal
              </h2>
              <p className="text-gray-600 mb-6">
                Register medicine batches, generate QR codes, and monitor your supply chain
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div>✅ AI Batch Validation</div>
                <div>✅ Blockchain Registration</div>
                <div>✅ QR Code Generation</div>
                <div>✅ Fraud Monitoring</div>
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Access Manufacturer Portal →
              </button>
            </div>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
            <div 
              className="text-center p-8"
              onClick={() => navigate('/pharmacy')}
            >
              <div className="text-6xl mb-6">🏥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pharmacy Portal
              </h2>
              <p className="text-gray-600 mb-6">
                Scan QR codes, verify medicine authenticity, and ensure patient safety
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div>✅ QR Code Scanning</div>
                <div>✅ AI Image Verification</div>
                <div>✅ Blockchain Validation</div>
                <div>✅ Trust Score Analysis</div>
              </div>
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                Access Pharmacy Portal →
              </button>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI validates batches and detects counterfeit medicines
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Secured</h3>
              <p className="text-gray-600 text-sm">
                Immutable records ensure medicine authenticity and traceability
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Ready</h3>
              <p className="text-gray-600 text-sm">
                Scan QR codes and verify medicines using mobile devices
              </p>
            </div>
          </Card>
        </div>

        {/* How It Works */}
        <Card title="How PharmaChain Works">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Register</h4>
              <p className="text-sm text-gray-600">
                Manufacturer registers medicine batch with AI validation
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure</h4>
              <p className="text-sm text-gray-600">
                Blockchain stores medicine hash and generates QR code
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Scan</h4>
              <p className="text-sm text-gray-600">
                Pharmacy scans QR code and captures package image
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Verify</h4>
              <p className="text-sm text-gray-600">
                AI verifies authenticity and provides trust score
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Built with ❤️ for pharmaceutical supply chain security</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;