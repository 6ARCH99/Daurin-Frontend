import React from 'react';

const TermsPage = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <button 
          type="button" 
          onClick={onClose} 
          className="flex items-center gap-2 text-gray-600 hover:text-[#1A3022] mb-8 group"
        >
          <div className="p-2 bg-white rounded-full shadow-sm group-hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </div>
          <span className="font-medium">Kembali</span>
        </button>

        <header className="mb-10">
          <h1 className="type-page-title mb-2">Syarat & Ketentuan</h1>
          <p className="text-gray-500 text-sm">Terakhir diperbarui: Juni 2026</p>
        </header>

        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">1. Pendahuluan</h2>
            <p className="text-gray-700 leading-relaxed">
              Syarat dan Ketentuan ini mengatur penggunaan layanan Daurin (selanjutnya disebut "Aplikasi"). 
              Dengan menggunakan Aplikasi, Anda menyetujui semua syarat yang tercantum di bawah ini.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">2. Penggunaan Layanan</h2>
            <p className="text-gray-700 leading-relaxed">
              Anda bertanggung jawab atas semua aktivitas yang dilakukan melalui akun Anda. 
              Anda setuju untuk tidak menggunakan Aplikasi untuk tujuan yang melanggar hukum atau merugikan pihak lain.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">3. Konten Pengguna</h2>
            <p className="text-gray-700 leading-relaxed">
              Anda mempertahankan hak kepemilikan atas konten yang Anda buat. Dengan mengunggah konten, 
              Anda memberikan lisensi kepada kami untuk menggunakan konten tersebut sesuai dengan kebijakan privasi kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">4. Batasan Tanggung Jawab</h2>
            <p className="text-gray-700 leading-relaxed">
              Aplikasi disediakan "sebagaimana adanya" tanpa jaminan apapun. Kami tidak bertanggung jawab atas 
              kerusakan langsung atau tidak langsung yang timbul dari penggunaan Aplikasi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">5. Perubahan Syarat</h2>
            <p className="text-gray-700 leading-relaxed">
              Kami berhak mengubah syarat ini kapan saja. Penggunaan Aplikasi yang berkelanjutan setelah perubahan 
              dianggap sebagai penerimaan syarat yang diperbarui.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">6. Hubungi Kami</h2>
            <p className="text-gray-700 leading-relaxed">
              Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami melalui 
              support@daurin.app
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
