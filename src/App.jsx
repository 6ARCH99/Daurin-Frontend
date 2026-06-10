import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { clearAuth, getStoredUser, setAuth } from './services/api.js';
import AnimatedPage from './components/motion/AnimatedPage.jsx';
import AnimatedRoute from './components/motion/AnimatedRoute.jsx';

// Import Komponen & Pages
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import Profile from './pages/Profile';
import Reward from './pages/Reward';
import Challenge from './pages/Challenge';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPPage from './pages/OTPPage'; 
import SuccessVerification from './pages/SuccessVerification';
import SettingsPage from './pages/SettingsPage'; 
import ForgotPassword from './pages/UbahPassword'; 
import NotificationPage from './pages/Notification';
import PreferencePage from './pages/PreferencePage'; 
import HelpPage from './pages/HelpPage'; 
import PenjemputanPage from './pages/PenjemputanPage'; 
import ImpactPage from './pages/ImpactPage'; 
import DropPointPage from './pages/DropPointPage'; 
import Leaderboard from './pages/Leaderboard'; 
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
// --- IMPORT PAGE BARU ---
import Badges from './pages/Badges'; 

// --- KOMPONEN PEMBANTU NAVIGASI ---
const SettingsWithNavigation = ({ handleLogout }) => {
  const navigate = useNavigate();
  return (
    <SettingsPage 
      onLogout={handleLogout}
      onChangePassword={() => navigate('/settings/password')}
      onGoToNotification={() => navigate('/settings/notifications')} 
      onGoToPreference={() => navigate('/settings/preferences')}
      onGoToHelp={() => navigate('/settings/help')}
      onBack={() => navigate('/profile')}
    />
  );
};

const NotificationWithNavigation = () => {
  const navigate = useNavigate();
  return <NotificationPage onBack={() => navigate('/settings')} />;
};

const PreferenceWithNavigation = () => {
  const navigate = useNavigate();
  return <PreferencePage onBack={() => navigate('/settings')} />;
};

const HelpWithNavigation = () => {
  const navigate = useNavigate();
  return <HelpPage onBack={() => navigate('/settings')} />;
};

// --- KOMPONEN UTAMA APP ---
function App() {
  const hasApiSession = () => !!localStorage.getItem('suarabumi_token');
  const [isLoggedIn, setIsLoggedIn] = useState(hasApiSession());
  const [user, setUser] = useState(getStoredUser);
  const [authView, setAuthView] = useState('landing');
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    if (hasApiSession()) {
      setUser(getStoredUser());
      setIsLoggedIn(true);
    }
  }, []);

  const requireApiSession = isLoggedIn && hasApiSession();

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser || getStoredUser());
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsLoggedIn(false);
    setAuthView('landing');
  };

  return (
    <Router>
      <div className="bg-[#F5F5F0] min-h-screen">
        {/* Navbar muncul hanya jika sudah login */}
        {isLoggedIn && <Navbar />}
        
        <main className={isLoggedIn ? "pt-20" : ""}>
          <Routes>
            {/* 1. ROUTE AUTHENTICATION */}
            <Route 
              path="/" 
              element={
                !isLoggedIn ? (
                  <AnimatedPage key={authView}>
                    {authView === 'landing' && (
                      <LandingPage 
                        onLogin={() => setAuthView('login')} 
                        onGoToRegister={() => setAuthView('register')} 
                      />
                    )}
                    {authView === 'login' && (
                      <LoginPage 
                        onBack={() => setAuthView('landing')} 
                        onLoginSuccess={handleLoginSuccess}
                        onGoToRegister={() => setAuthView('register')} 
                        onForgotPassword={() => setAuthView('forgot-password')}
                      />
                    )}
                    {authView === 'register' && (
                      <RegisterPage
                        onBack={() => setAuthView('landing')}
                        onGoToLogin={() => setAuthView('login')}
                        onRegisterSuccess={handleLoginSuccess}
                        onContinue={(phone) => {
                          setUserPhone(phone);
                          setAuthView('otp');
                        }}
                      />
                    )}
                    {authView === 'otp' && (
                      <OTPPage 
                        phoneNumber={userPhone || "+62 812-3456-789"}
                        onBack={() => setAuthView('register')} 
                        onVerifySuccess={() => setAuthView('success')} 
                      />
                    )}
                    {authView === 'success' && (
                      <SuccessVerification
                        onComplete={() => {
                          setAuthView('login');
                        }}
                      />
                    )}
                    {authView === 'forgot-password' && (
                      <ForgotPassword onBack={() => setAuthView('login')} />
                    )}
                  </AnimatedPage>
                ) : (
                  <Navigate to="/home" replace />
                )
              } 
            />

            {/* 2. ROUTE UTAMA (PROTECTED) */}
            <Route
              path="/home"
              element={
                requireApiSession ? (
                  <AnimatedRoute>
                    <Home user={user} key={user?.id || 'home'} />
                  </AnimatedRoute>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/reward" element={isLoggedIn ? <AnimatedRoute><Reward /></AnimatedRoute> : <Navigate to="/" />} />
            <Route path="/challenge" element={isLoggedIn ? <AnimatedRoute><Challenge /></AnimatedRoute> : <Navigate to="/" />} />
            <Route path="/impact" element={requireApiSession ? <AnimatedRoute><ImpactPage /></AnimatedRoute> : <Navigate to="/" />} />
            <Route path="/drop-point" element={isLoggedIn ? <AnimatedRoute><DropPointPage /></AnimatedRoute> : <Navigate to="/" />} />
            <Route path="/penjemputan" element={isLoggedIn ? <AnimatedRoute><PenjemputanPage /></AnimatedRoute> : <Navigate to="/" />} />
            
            {/* --- ROUTE LEADERBOARD & BADGES --- */}
            <Route path="/leaderboard" element={isLoggedIn ? <AnimatedRoute><Leaderboard /></AnimatedRoute> : <Navigate to="/" />} />
            <Route path="/badges" element={isLoggedIn ? <AnimatedRoute><Badges /></AnimatedRoute> : <Navigate to="/" />} />

            <Route
              path="/profile"
              element={
                requireApiSession ? (
                  <AnimatedRoute>
                    <Profile
                      user={user}
                      onLogout={handleLogout}
                      onUserUpdate={(u) => setUser(u)}
                    />
                  </AnimatedRoute>
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* 3. ROUTE PENGATURAN & SUB-SETTINGS */}
            <Route 
              path="/settings" 
              element={isLoggedIn ? <AnimatedRoute><SettingsWithNavigation handleLogout={handleLogout} /></AnimatedRoute> : <Navigate to="/" />} 
            />
            <Route 
              path="/settings/notifications" 
              element={isLoggedIn ? <AnimatedRoute><NotificationWithNavigation /></AnimatedRoute> : <Navigate to="/" />} 
            />
            <Route 
              path="/settings/preferences" 
              element={isLoggedIn ? <AnimatedRoute><PreferenceWithNavigation /></AnimatedRoute> : <Navigate to="/" />} 
            />
            <Route 
              path="/settings/help" 
              element={isLoggedIn ? <AnimatedRoute><HelpWithNavigation /></AnimatedRoute> : <Navigate to="/" />} 
            />
            <Route 
              path="/settings/password" 
              element={isLoggedIn ? <AnimatedRoute><ForgotPassword onBack={() => window.history.back()} /></AnimatedRoute> : <Navigate to="/" />} 
            />

            {/* 4. ROUTE TERMS & PRIVACY */}
            <Route 
              path="/terms" 
              element={<TermsPage onClose={() => window.history.back()} />} 
            />
            <Route 
              path="/privacy" 
              element={<PrivacyPage onClose={() => window.history.back()} />} 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;