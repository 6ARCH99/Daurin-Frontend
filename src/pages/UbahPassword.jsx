import React, { useState } from 'react';
import { api } from '../services/api';

const UbahPassword = ({ onBack }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    if (formData.newPassword.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    setLoading(true);
    try {
      await api.changePassword(formData.oldPassword, formData.newPassword);
      onBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-[#1A3022] mb-8 group">
          <div className="p-2 bg-white rounded-full shadow-sm group-hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <span className="font-medium">Kembali</span>
        </button>

        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="type-page-title mb-3">Ubah Password</h1>
            <p className="text-gray-500 text-sm">Disimpan aman di server</p>
          </header>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-[32px] shadow-sm p-8 md:p-10 border border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#1A3022] block mb-2">Password Lama</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="w-full bg-[#F5F5F0] px-5 py-4 rounded-2xl text-sm outline-none focus:border-green-600 border border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#1A3022] block mb-2">Password Baru</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-[#F5F5F0] px-5 py-4 rounded-2xl text-sm outline-none focus:border-green-600 border border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#1A3022] block mb-2">Konfirmasi</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#F5F5F0] px-5 py-4 rounded-2xl text-sm outline-none focus:border-green-600 border border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A3022] text-white py-4 rounded-2xl font-bold text-sm disabled:opacity-50"
              >
                {loading ? 'Menyimpan…' : 'Simpan Password Baru'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UbahPassword;
