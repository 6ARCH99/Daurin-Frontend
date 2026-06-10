import React, { useEffect } from 'react';

const SuccessVerification = ({ onComplete }) => {
  useEffect(() => {
    // Timer untuk otomatis pindah ke dashboard setelah 2 detik
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer); // Membersihkan timer saat komponen tidak lagi muncul
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans flex flex-col">
      {/* Navbar Minimalis */}
      <nav className="flex justify-between items-center px-10 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1A3022] rounded-full flex items-center justify-center text-white text-xs">🌱</div>
          <span className="text-xl font-bold text-[#1A3022]">Daurin.</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <span>Fitur</span>
          <span>Cara Kerja</span>
          <span>Review</span>
        </div>

        <div className="flex gap-4">
          <button className="text-sm font-bold text-[#1A3022] px-6 py-2">Masuk</button>
          <button className="bg-[#1A3022] text-white text-sm font-bold px-8 py-2 rounded-full shadow-md">Daftar</button>
        </div>
      </nav>

      {/* Content Berhasil */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        {/* Icon Checkmark */}
        <div className="w-24 h-24 bg-[#D8E6DC] rounded-full flex items-center justify-center mb-10" style={{ animation: 'scaleIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
          <div className="w-12 h-12 border-b-4 border-r-4 border-[#1A3022] rotate-45 mb-2 ml-1"></div>
        </div>

        <h1 className="text-5xl font-bold text-[#1A3022] mb-6 font-heading">Verifikasi Berhasil!</h1>
        
        <p className="text-gray-500 text-lg max-w-md">
          Akun Tunas kamu sudah aktif. Selamat datang di perjalanan aksi iklim!
        </p>

        {/* Loading Indicator */}
        <div className="mt-12 flex items-center gap-2 bg-[#FEF9E7] px-6 py-2 rounded-full border border-[#F9E79F]">
          <div className="w-2 h-2 bg-[#F1C40F] rounded-full animate-pulse"></div>
          <span className="text-[#996515] text-xs font-bold tracking-wide">
            Mengarahkan ke halaman Masuk…
          </span>
        </div>
        <p className="text-gray-400 text-xs max-w-md mt-4">
          Gunakan <strong>Masuk</strong> dengan akun Anda (demo: putra.wijaya@email.com / password123) supaya data backend tampil di Home & Impact.
        </p>
      </div>
    </div>
  );
};

export default SuccessVerification;