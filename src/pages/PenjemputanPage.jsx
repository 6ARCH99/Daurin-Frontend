import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { Trash2, CalendarDays, MapPin, Scale, Lightbulb } from 'lucide-react';

const STATUS_LABEL = {
  scheduled: 'Terjadwal',
  in_transit: 'Dalam Perjalanan',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

function formatSchedule(iso) {
  const d = new Date(iso);
  return {
    tanggal: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    waktu: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };
}

const PenjemputanPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ date: '', time: '', address: '', weight: '' });
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getPickups();
      setPickups(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.address || !form.weight) {
      setError('Lengkapi semua field jadwal.');
      return;
    }
    const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString();
    setSubmitting(true);
    setError('');
    try {
      if (editingId) {
        // Update existing pickup
        await api.updatePickup(editingId, {
          address: form.address,
          scheduledAt,
          estimatedWeightKg: Number(form.weight),
        });
      } else {
        // Create new pickup
        await api.createPickup({
          address: form.address,
          scheduledAt,
          estimatedWeightKg: Number(form.weight),
        });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setForm({ date: '', time: '', address: '', weight: '' });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (pickup) => {
    const d = new Date(pickup.scheduledAt);
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().slice(0, 5);
    setForm({
      date,
      time,
      address: pickup.address,
      weight: String(pickup.estimatedWeightKg),
    });
    setEditingId(pickup.id);
    setIsModalOpen(true);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Batalkan jadwal ini?')) return;
    try {
      await api.cancelPickup(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-page">
      <div className="app-page-inner max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center app-page-header gap-4">
          <div>
            <h1 className="type-page-title mb-2">Penjemputan Sampah</h1>
            <p className="type-page-subtitle">Jadwalkan atau kelola penjemputan sampah terpilahmu.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1A3022] text-white px-6 py-3 rounded-xl type-tab flex items-center gap-2 shadow-md"
          >
            <span className="text-xl">+</span> Buat Jadwal Baru
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 mb-10">
          <h2 className="type-section-title-lg text-[#1A3022] text-center mb-10">Jadwal Aktif</h2>
          {loading && <p className="text-center text-gray-400">Memuat…</p>}
          {!loading && pickups.length === 0 && (
            <p className="text-center text-gray-400">Belum ada jadwal. Buat jadwal baru.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pickups.map((item) => {
              const { tanggal, waktu } = formatSchedule(item.scheduledAt);
              return (
                <div key={item.id} className="bg-[#F9F9F6] border border-gray-100 rounded-3xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-[#E9F5EF] text-[#2D4A37] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      {STATUS_LABEL[item.status] || item.status}
                    </span>
                    {item.status === 'scheduled' && (
                      <button
                        type="button"
                        onClick={() => handleCancel(item.id)}
                        className="text-red-400 hover:text-red-600"
                        aria-label="Batalkan"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CalendarDays size={18} className="text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Tanggal & Waktu</p>
                        <p className="text-sm font-bold text-[#1A3022]">
                          {tanggal}, {waktu}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Lokasi</p>
                        <p className="text-sm text-gray-600">{item.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Scale size={18} className="text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Estimasi</p>
                        <p className="text-sm font-bold text-[#1A3022]">{item.estimatedWeightKg} kg</p>
                      </div>
                    </div>
                  </div>
                  {item.status === 'scheduled' && (
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="w-full bg-[#1A3022] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2d4a37]"
                    >
                      Ubah Jadwal
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#E9F5EF] border border-[#CDE5D9] rounded-[24px] p-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb size={24} className="text-[#2D4A37]" />
            <h3 className="font-bold text-[#2D4A37]">Tips Penjemputan Lancar</h3>
          </div>
          <ul className="space-y-3 text-sm text-[#2D4A37] opacity-80 list-disc list-inside ml-2">
            <li>Pastikan sampah sudah dipilah sesuai kategori (Plastik, Kertas, Logam, Kaca)</li>
            <li>Bersihkan sampah dari sisa makanan atau cairan</li>
            <li>Siapkan sampah di lokasi yang mudah dijangkau</li>
            <li>Konfirmasi 1 hari sebelumnya jika ada perubahan jadwal</li>
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm modal-backdrop"
          onClick={() => {
            setIsModalOpen(false);
            setEditingId(null);
            setForm({ date: '', time: '', address: '', weight: '' });
          }}
          role="dialog"
          aria-modal="true"
        >
          <form
            className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl border p-8 modal-panel"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreate}
          >
            <h2 className="type-section-title-lg text-[#1A3022] mb-8">
              {editingId ? 'Edit Jadwal Penjemputan' : 'Jadwal Penjemputan Baru'}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold mb-2">Pilih Tanggal</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full bg-[#F9F9F6] border rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Pilih Waktu</label>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className="w-full bg-[#F9F9F6] border rounded-xl px-4 py-3"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Alamat Penjemputan</label>
              <textarea
                required
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full bg-[#F9F9F6] border rounded-xl px-4 py-3 h-24"
                placeholder="Masukkan alamat lengkap..."
              />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-bold mb-2">Estimasi Berat (kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                className="w-full bg-[#F9F9F6] border rounded-xl px-4 py-3"
                placeholder="Contoh: 5"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#1A3022] text-white py-3.5 rounded-xl font-bold disabled:opacity-50"
              >
                {submitting ? 'Menyimpan…' : editingId ? 'Simpan Perubahan' : 'Konfirmasi Jadwal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                  setForm({ date: '', time: '', address: '', weight: '' });
                }}
                className="flex-1 border py-3.5 rounded-xl font-bold"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PenjemputanPage;
