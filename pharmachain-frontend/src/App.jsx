import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Landing Page
import Landing from './pages/Landing';

// Manufacturer Pages
import ManufacturerLogin from './pages/manufacturer/Login';
import ManufacturerDashboard from './pages/manufacturer/Dashboard';
import RegisterBatch from './pages/manufacturer/RegisterBatch';
import BatchList from './pages/manufacturer/BatchList';
import BatchDetails from './pages/manufacturer/BatchDetails';
import WatchdogMonitor from './pages/manufacturer/WatchdogMonitor';

// Pharmacy Pages
import PharmacyDashboard from './pages/pharmacy/Dashboard';
import ScanVerify from './pages/pharmacy/ScanVerify';
import VerificationResult from './pages/pharmacy/VerificationResult';
import Report from './pages/pharmacy/Report';

// System Pages
import SystemStatus from './pages/SystemStatus';

// No authentication required - direct access to functionality

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Landing />} />
          
          {/* Manufacturer Routes - With Authentication */}
          <Route path="/manufacturer/login" element={<ManufacturerLogin />} />
          <Route path="/manufacturer" element={<ManufacturerDashboard />} />
          <Route path="/manufacturer/register-batch" element={<RegisterBatch />} />
          <Route path="/manufacturer/batches" element={<BatchList />} />
          <Route path="/manufacturer/batch/:id" element={<BatchDetails />} />
          <Route path="/manufacturer/watchdog" element={<WatchdogMonitor />} />
          
          {/* Pharmacy Routes - Direct Access */}
          <Route path="/pharmacy" element={<PharmacyDashboard />} />
          <Route path="/pharmacy/scan-verify" element={<ScanVerify />} />
          <Route path="/pharmacy/verification-result" element={<VerificationResult />} />
          <Route path="/pharmacy/report" element={<Report />} />
          
          {/* System Routes */}
          <Route path="/system-status" element={<SystemStatus />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;