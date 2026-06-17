import React, { useState } from 'react';
import LogoDaurin from '../assets/Logo Daurin.jpeg';
import { api, setAuth } from '../services/api.js';
import Icon from '../components/Icon.jsx';

const LoginPage = ({ onBack, onLoginSuccess, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const navigateToSection = (sectionId) => {
    onBack();
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid (harus ada @ dan .com)";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { token, user } = await api.login(email, password);
      setAuth(token, {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setSubmitError(err.message || "Login gagal. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage('');
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotMessage('Masukkan email yang valid');
      return;
    }
    setForgotLoading(true);
    try {
      await api.forgotPassword(forgotEmail);
      setForgotMessage('Link reset password telah dikirim ke email Anda');
      setForgotEmail('');
    } catch (err) {
      setForgotMessage(err.message || 'Gagal mengirim link reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans text-left">
      <nav className="animate-nav flex justify-between items-center px-10 py-6 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <img
            src={LogoDaurin}
            alt="Logo"
            className="w-8 h-8 rounded-full object-cover shadow-sm"
          />
          <span className="text-xl font-bold text-[#1A3022]">
            Daurin<span className="text-orange-500">.</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <span onClick={() => navigateToSection('fitur')} className="cursor-pointer hover:text-[#1A3022] transition-colors">Fitur</span>
          <span onClick={() => navigateToSection('cara-kerja')} className="cursor-pointer hover:text-[#1A3022] transition-colors">Cara Kerja</span>
          <span onClick={() => navigateToSection('review')} className="cursor-pointer hover:text-[#1A3022] transition-colors">Review</span>
        </div>
        <div className="flex gap-4">
          <button className="text-sm font-bold text-[#1A3022] px-6 py-2">Masuk</button>
          <button
            onClick={onGoToRegister}
            className="bg-[#1A3022] text-white text-sm font-bold px-8 py-2 rounded-full hover:opacity-90 transition-all"
          >
            Daftar
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 text-sm font-bold mb-10 hover:text-[#1A3022] transition-colors"
        >
          ← Kembali ke Beranda
        </button>

        <div className="flex flex-col items-center w-full">
          <h2 className="text-4xl font-bold text-[#1A3022] mb-2 font-heading">Selamat Datang Kembali!</h2>
          <p className="text-gray-500 text-sm mb-10">Lanjutkan perjalanan aksi iklimmu bersama Daurin</p>

          <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-xl card-interactive">
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl">{submitError}</p>
              )}
              <p className="text-[10px] text-gray-400 bg-[#F5F5F0] p-3 rounded-xl">
                Demo API: putra.wijaya@email.com / password123
              </p>

              <div className="text-left">
                <label htmlFor="email" className="text-[10px] font-bold text-[#1A3022] uppercase tracking-widest block mb-2">Email</label>
                <div className={`flex items-center gap-3 bg-[#F5F5F0] px-4 py-3.5 rounded-xl border transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-transparent focus-within:border-[#2D6A4F]'}`}>
                  <Icon name="mail" size={18} className="text-gray-400 flex-shrink-0" ariaHidden={true} />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    className="bg-transparent w-full outline-none text-sm text-[#1A3022] min-h-[44px]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold italic" role="alert">{errors.email}</p>}
              </div>

              <div className="text-left">
                <label htmlFor="password" className="text-[10px] font-bold text-[#1A3022] uppercase tracking-widest block mb-2">Password</label>
                <div className={`flex items-center gap-3 bg-[#F5F5F0] px-4 py-3.5 rounded-xl border transition-all ${errors.password ? 'border-red-500 bg-red-50' : 'border-transparent focus-within:border-[#2D6A4F]'}`}>
                  <Icon name="lock" size={18} className="text-gray-400 flex-shrink-0" ariaHidden={true} />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="bg-transparent w-full outline-none text-sm text-[#1A3022] min-h-[44px]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold italic" role="alert">{errors.password}</p>}
                <div className="text-right mt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowForgotModal(true)} 
                    className="text-[10px] font-bold text-gray-400 uppercase hover:text-[#2D6A4F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 rounded px-2 py-1"
                  >
                    Lupa password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full min-h-[48px] bg-[#1A3022] text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                Belum punya akun? <span onClick={onGoToRegister} className="text-[#1A3022] font-bold cursor-pointer hover:underline">Daftar Gratis</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl border p-8">
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">Lupa Password?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
            </p>
            {forgotMessage && (
              <p className={`text-sm mb-4 p-3 rounded-xl ${forgotMessage.includes('berhasil') || forgotMessage.includes('telah dikirim') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {forgotMessage}
              </p>
            )}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1A3022] mb-2">Email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-[#F5F5F0] border border-transparent rounded-xl px-4 py-3 text-sm focus:border-[#2D6A4F] outline-none"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 bg-[#1A3022] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {forgotLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotEmail('');
                    setForgotMessage('');
                  }}
                  className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
