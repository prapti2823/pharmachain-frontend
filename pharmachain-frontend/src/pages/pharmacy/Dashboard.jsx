import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { medicineAPI, pharmacyAPI } from '../../utils/api';

const PharmacyDashboard = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    acceptedMedicines: 0,
    rejectedMedicines: 0,
    reviewRequired: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pharmacy = 'MediCare Plus Pharmacy';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch scan history
      const scansResponse = await medicineAPI.getScans();
      const scans = scansResponse.data.scans || [];
      
      // Calculate stats from scan data with multiple status formats
      const acceptedScans = scans.filter(s => {
        const status = s.status?.toLowerCase();
        const aiDecision = s.ai_decision?.toLowerCase();
        const result = s.result?.toLowerCase();
        return status === 'verified' || status === 'authentic' || status === 'valid' ||
               aiDecision === 'accept' || aiDecision === 'approved' ||
               result === 'verified' || result === 'authentic' || result === 'valid';
      }).length;
      
      const rejectedScans = scans.filter(s => {
        const status = s.status?.toLowerCase();
        const aiDecision = s.ai_decision?.toLowerCase();
        const result = s.result?.toLowerCase();
        return status === 'rejected' || status === 'counterfeit' || status === 'invalid' ||
               aiDecision === 'reject' || aiDecision === 'denied' ||
               result === 'rejected' || result === 'counterfeit' || result === 'invalid';
      }).length;
      
      const reviewScans = scans.filter(s => {
        const status = s.status?.toLowerCase();
        const aiDecision = s.ai_decision?.toLowerCase();
        const result = s.result?.toLowerCase();
        return status === 'review' || status === 'pending' || status === 'suspicious' ||
               aiDecision === 'review' || aiDecision === 'manual' ||
               result === 'review' || result === 'pending' || result === 'suspicious';
      }).length;
      
      setStats({
        totalScans: scans.length,
        acceptedMedicines: acceptedScans,
        rejectedMedicines: rejectedScans,
        reviewRequired: reviewScans
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Pharmacy Portal</h1>
                <p className="text-slate-600 font-medium">{pharmacy}</p>
              </div>
            </div>
            <button
              onClick={goHome}
              className="flex items-center space-x-2 px-4 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Home</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Scans</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalScans}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">Total verifications</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Authentic</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.acceptedMedicines}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{stats.totalScans > 0 ? Math.round((stats.acceptedMedicines / stats.totalScans) * 100) : 0}% success rate</p>
              </div>
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Need Review</p>
                <p className="text-3xl font-bold text-amber-600">{stats.reviewRequired}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Manual check required</p>
              </div>
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejectedMedicines}</p>
                <p className="text-xs text-red-600 font-medium mt-1">Counterfeit detected</p>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">Verify Medicine Authenticity</h2>
                <p className="text-cyan-100 mb-6 text-lg leading-relaxed">
                  Scan QR codes and capture package images for instant AI-powered verification with blockchain security and real-time trust scoring.
                </p>
                <button
                  onClick={() => navigate('/pharmacy/scan-verify')}
                  className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-semibold hover:bg-cyan-50 transition-all duration-200 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span>Start Verification</span>
                </button>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Secondary Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Additional Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => alert('Feature coming soon!')}
              className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <svg className="w-7 h-7 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Verification Reports</h4>
              <p className="text-sm text-slate-600">View detailed verification history and analytics</p>
            </button>

            <button
              onClick={() => alert('Feature coming soon!')}
              className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Alert Center</h4>
              <p className="text-sm text-slate-600">Monitor counterfeit alerts and security notifications</p>
            </button>

            <button
              onClick={() => alert('Feature coming soon!')}
              className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Training Center</h4>
              <p className="text-sm text-slate-600">Learn about medicine verification best practices</p>
            </button>
          </div>
        </div>

        {/* Verification Guide */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800">AI Verification Process</h3>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-600">1</span>
                  </div>
                  How to Verify
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Scan QR Code</p>
                      <p className="text-sm text-slate-600">Use camera to scan the encrypted QR code on medicine package</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Capture Image</p>
                      <p className="text-sm text-slate-600">Take a clear photo of the medicine package for AI comparison</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">AI Analysis</p>
                      <p className="text-sm text-slate-600">Get instant verification results with blockchain validation and trust score</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-600">AI</span>
                  </div>
                  AI Decision Guide
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-emerald-800">ACCEPT</span>
                    </div>
                    <span className="text-sm font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">80-100% Trust</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-amber-800">REVIEW</span>
                    </div>
                    <span className="text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">60-79% Trust</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-red-800">REJECT</span>
                    </div>
                    <span className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">0-59% Trust</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;