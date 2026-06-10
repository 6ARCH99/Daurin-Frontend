import React, { useState, useRef } from 'react';
import { api } from '../services/api.js';

const OTPPage = ({ onBack, onVerifySuccess, phoneNumber = "+62 812-3456-789", email = "" }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Otomatis pindah ke box selanjutnya
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Kembali ke box sebelumnya jika tekan backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setError('Masukkan 6 digit kode OTP');
      return;
    }
    setLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/\+62/, '0');
      await api.verifyOtp(cleanPhone, finalOtp, 'register');
      onVerifySuccess();
    } catch (err) {
      setError(err.message || 'Verifikasi OTP gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resendLoading) return;
    setResendLoading(true);
    setError('');
    try {
      const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/\+62/, '0');
      await api.resendOtp(cleanPhone, email, 'register');
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulang OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans pb-20">
      {/* Navbar Minimalis */}
      <nav className="animate-nav flex justify-between items-center px-10 py-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <div className="w-8 h-8 bg-[#1A3022] rounded-full flex items-center justify-center text-white text-xs">🌱</div>
          <span className="text-xl font-bold text-[#1A3022]">Daurin.</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <span className="cursor-pointer hover:text-[#1A3022]">Fitur</span>
          <span className="cursor-pointer hover:text-[#1A3022]">Cara Kerja</span>
          <span className="cursor-pointer hover:text-[#1A3022]">Review</span>
        </div>

        <div className="flex gap-4">
          <button className="text-sm font-bold text-[#1A3022] px-6 py-2">Masuk</button>
          <button className="bg-[#1A3022] text-white text-sm font-bold px-8 py-2 rounded-full shadow-md">Daftar</button>
        </div>
      </nav>

      {/* Header Halaman */}
      <div className="text-center mt-12 mb-10">
        <span className="bg-[#D8E6DC] text-[#2D6A4F] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
          Langkah 2 dari 2
        </span>
        <h1 className="text-5xl font-bold text-[#1A3022] mt-6 mb-4 font-heading leading-tight">Verifikasi OTP</h1>
        <p className="text-gray-500 text-sm">Kami telah mengirimkan kode 6 digit ke</p>
        <p className="font-bold text-[#1A3022] mt-1">{phoneNumber}</p>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-[40px] shadow-sm p-12 border border-gray-100 flex flex-col items-center card-interactive">
          
          <form onSubmit={handleVerify} className="w-full space-y-10">
            {/* Input OTP Row */}
            <div className="flex justify-between gap-2 sm:gap-4 max-w-md mx-auto">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-16 sm:w-16 sm:h-20 bg-[#F5F5F0] rounded-2xl text-center text-2xl font-bold text-[#1A3022] outline-none border-2 border-transparent focus:border-[#2D6A4F] transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="text-center">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Tidak menerima kode?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || resendLoading}
                  className="text-[#1A3022] font-bold cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? 'Mengirim...' : resendTimer > 0 ? `Kirim ulang (${resendTimer}s)` : 'Kirim ulang'}
                </button>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 max-w-md mx-auto">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A3022] text-white py-5 rounded-2xl font-bold text-sm hover:opacity-95 transition-all shadow-lg active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi'}
              </button>
              
              <button 
                type="button"
                onClick={onBack}
                className="w-full bg-[#F5F5F0] text-gray-600 py-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
              >
                ← Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;