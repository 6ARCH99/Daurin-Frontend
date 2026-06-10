import React from 'react';

const PrivacyPage = ({ onClose }) => {
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
          <h1 className="type-page-title mb-2">Kebijakan Privasi</h1>
          <p className="text-gray-500 text-sm">Terakhir diperbarui: Juni 2026</p>
        </header>

        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">1. Pengumpulan Data</h2>
            <p className="text-gray-700 leading-relaxed">
              Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, email, dan nomor telepon. 
              Kami juga mengumpulkan data penggunaan untuk meningkatkan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">2. Penggunaan Data</h2>
            <p className="text-gray-700 leading-relaxed">
              Data Anda digunakan untuk memberikan layanan, meningkatkan pengalaman pengguna, 
              dan mengirim komunikasi yang relevan sesuai preferensi Anda.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">3. Keamanan Data</h2>
            <p className="text-gray-700 leading-relaxed">
              Kami menggunakan enkripsi dan langkah keamanan lainnya untuk melindungi data pribadi Anda 
              dari akses tidak sah.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">4. Pihak Ketiga</h2>
            <p className="text-gray-700 leading-relaxed">
              Kami tidak menjual data Anda kepada pihak ketiga. Data hanya dibagikan dengan mitra layanan 
              yang diperlukan untuk operasi Aplikasi, dan mereka terikat oleh perjanjian kerahasiaan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">5. Hak Anda</h2>
            <p className="text-gray-700 leading-relaxed">
              Anda berhak mengakses, mengubah, atau menghapus data pribadi Anda. 
              Hubungi kami di privacy@daurin.app untuk memproses permintaan Anda.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">6. Perubahan Kebijakan</h2>
            <p className="text-gray-700 leading-relaxed">
              Kami dapat memperbarui kebijakan ini. Pembaruan signifikan akan diumumkan melalui email atau di Aplikasi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A3022] mb-4">7. Hubungi Kami</h2>
            <p className="text-gray-700 leading-relaxed">
              Untuk pertanyaan tentang Kebijakan Privasi, hubungi privacy@daurin.app
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
