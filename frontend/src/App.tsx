import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Documentation from './pages/Documentation'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import PatientDashboard from './pages/PatientDashboard'
import SymptomChecker from './pages/SymptomChecker'
import EmergencyQR from './pages/EmergencyQR'
import BillAnalysis from './pages/BillAnalysis'
import DoctorFinder from './pages/DoctorFinder'
import DoctorRegistration from './pages/DoctorRegistration'
import DoctorDashboard from './pages/DoctorDashboard'
import PatientRecordViewer from './pages/PatientRecordViewer'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/login" element={<Login />} />

          {/* Patient Routes */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/emergency-qr" element={<EmergencyQR />} />
          <Route path="/bill-analysis" element={<BillAnalysis />} />
          <Route path="/doctor-finder" element={<DoctorFinder />} />
          <Route path="/upload-record" element={<PatientDashboard />} /> {/* Placeholder */}

          {/* Doctor Routes */}
          <Route path="/doctor-registration" element={<DoctorRegistration />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/patient-record/:patientId" element={<PatientRecordViewer />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
