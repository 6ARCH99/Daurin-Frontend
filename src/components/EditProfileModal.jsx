import React, { useEffect, useState } from 'react';
import { api, setAuth, getImageUrl } from '../services/api.js';

const EditProfileModal = ({ isOpen, onClose, profile, onSaved }) => {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (isOpen && profile) {
      setForm({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
      setErrors({});
      setSubmitError('');
      setPhotoFile(null);
      setPhotoPreview(profile.profilePhotoUrl || '');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSubmitError('File harus berupa gambar (JPEG, PNG, dll).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('Ukuran gambar maksimal 5MB.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setSubmitError('');
    }
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      next.fullName = 'Nama minimal 2 karakter';
    }
    if (!form.phone.trim() || form.phone.trim().length < 8) {
      next.phone = 'Nomor telepon minimal 8 digit';
    }
    if (!form.address.trim() || form.address.trim().length < 5) {
      next.address = 'Alamat minimal 5 karakter';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setLoading(true);
    try {
      let finalProfilePhotoUrl = profile?.profilePhotoUrl;
      if (photoFile) {
        const photoRes = await api.uploadProfilePhoto(photoFile);
        finalProfilePhotoUrl = photoRes.data.profilePhotoUrl;
      }

      const res = await api.updateProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });
      const updated = { ...res.data, profilePhotoUrl: finalProfilePhotoUrl };
      
      const token = localStorage.getItem('suarabumi_token');
      if (token) {
        setAuth(token, {
          id: updated.id,
          name: updated.fullName,
          email: updated.email,
          phone: updated.phone,
          address: updated.address,
        });
      }
      onSaved?.(updated);
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Gagal menyimpan profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div
        className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-50">
          <div>
            <h2 id="edit-profile-title" className="text-2xl font-bold text-[#1A3022] font-heading">
              Edit Profil
            </h2>
            <p className="text-xs text-gray-400 mt-1">Perbarui informasi akun kamu</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#F5F5F0] text-gray-500 font-bold hover:bg-gray-200 transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {submitError && (
            <p className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl">{submitError}</p>
          )}

          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-[#2D4A37] rounded-full flex items-center justify-center overflow-hidden shadow-sm border-4 border-white">
                {photoPreview ? (
                  <img src={getImageUrl(photoPreview)} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-3xl font-bold font-heading">
                    {form.fullName.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#D99A29] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform"
                title="Ganti Foto"
              >
                📷
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handlePhotoChange}
            />
          </div>

          <div className="text-left">
            <label className="text-[10px] font-bold text-[#1A3022] uppercase tracking-widest block mb-2">
              Email
            </label>
            <div className="flex items-center gap-3 bg-gray-100 px-4 py-3.5 rounded-xl border border-gray-100">
              <span className="text-gray-400">✉</span>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="bg-transparent w-full outline-none text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Email tidak dapat diubah</p>
          </div>

          <div className="text-left">
            <label className="text-[10px] font-bold text-[#1A3022] uppercase tracking-widest block mb-2">
              Nama Lengkap *
            </label>
            <div className={`flex items-center gap-3 bg-[#F5F5F0] px-4 py-3.5 rounded-xl border ${errors.fullName ? 'border-red-400' : 'border-transparent focus-within:border-[#2D6A4F]'}`}>
              <span className="text-gray-400">👤</span>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="bg-transparent w-full outline-none text-sm text-[#1A3022]"
                placeholder="Nama lengkap"
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.fullName}</p>}
          </div>

          <div className="text-left">
            <label className="text-[10px] font-bold text-[#1A3022] uppercase tracking-widest block mb-2">
              Nomor Telepon *
            </label>
            <div className={`flex items-center gap-3 bg-[#F5F5F0] px-4 py-3.5 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-transparent focus-within:border-[#2D6A4F]'}`}>
              <span className="text-gray-400">📞</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-transparent w-full outline-none text-sm text-[#1A3022]"
                placeholder="08123456789"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.phone}</p>}
          </div>

          <div className="text-left">
            <label className="text-[10px] font-bold text-[#1A3022] uppercase tracking-widest block mb-2">
              Alamat Lengkap *
            </label>
            <div className={`bg-[#F5F5F0] px-4 py-3.5 rounded-xl border ${errors.address ? 'border-red-400' : 'border-transparent focus-within:border-[#2D6A4F]'}`}>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                className="bg-transparent w-full outline-none text-sm text-[#1A3022] resize-none"
                placeholder="Jl. Contoh No. 123, Kelurahan, Kota"
              />
            </div>
            {errors.address && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.address}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 rounded-xl bg-[#1A3022] text-white text-sm font-bold btn-motion disabled:opacity-60"
            >
              {loading ? 'Menyimpan…' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
