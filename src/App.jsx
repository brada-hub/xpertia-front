import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pilares from './components/Pilares';
import Diferencial from './components/Diferencial';
import Services from './components/Services';
import Proceso from './components/Proceso';
import Equipo from './components/Equipo';
import Contacto from './components/Contacto';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import SocialSidebar from './components/SocialSidebar';
import CarnivalAnimation from './components/CarnivalAnimation';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProjectsDashboard from './pages/ProjectsDashboard';
import ClientsManagement from './pages/ClientsManagement';
import PersonnelManagement from './pages/PersonnelManagement';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import { useTheme } from './context/ThemeContext';

// Main website component
function MainWebsite() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark
      ? 'bg-primary text-white'
      : 'bg-slate-50 text-gray-900'
      } selection:bg-accent selection:text-white relative`}>
      <AnimatedBackground />
      <CarnivalAnimation />
      <SocialSidebar />
      <div className="relative z-10 font-sans">
        <Navbar />
        <main className="flex flex-col gap-0">
          <Hero />

          {/* Sutil Separador */}
          <div className={`h-px w-full max-w-7xl mx-auto ${isDark ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-black/5 to-transparent'}`} />

          <div className={isDark ? 'bg-slate-900/20' : 'bg-slate-100/50'}>
            <Pilares />
          </div>

          <div className={`h-px w-full max-w-7xl mx-auto ${isDark ? 'bg-gradient-to-r from-transparent via-accent/10 to-transparent' : 'bg-gradient-to-r from-transparent via-accent/20 to-transparent'}`} />

          <Diferencial />

          <div className={`h-[2px] w-full ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />

          <Services />

          <div className={isDark ? 'bg-slate-900/30' : 'bg-slate-100/30'}>
            <Proceso />
          </div>

          <div className={`h-px w-full max-w-4xl mx-auto ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />

          <Equipo />

          <div className={isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}>
            <Contacto />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainWebsite />} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<ProjectsDashboard />} />
          <Route path="clients" element={<ClientsManagement />} />
          <Route path="personnel" element={<PersonnelManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
