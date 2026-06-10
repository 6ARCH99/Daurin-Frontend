import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

const HelpPage = ({ onBack }) => {
  const [faqs, setFaqs] = useState([]);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const [ticketMsg, setTicketMsg] = useState('');

  const loadFaqs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = query.trim()
        ? await api.searchFaqs(query.trim())
        : await api.getFaqs();
      setFaqs(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const t = setTimeout(loadFaqs, 300);
    return () => clearTimeout(t);
  }, [loadFaqs]);

  const handleTicket = async (e) => {
    e.preventDefault();
    setTicketMsg('');
    try {
      await api.submitSupportTicket(ticket.subject, ticket.message);
      setTicketMsg('Tiket terkirim. Tim support akan membalas via email.');
      setTicket({ subject: '', message: '' });
      setTicketOpen(false);
    } catch (err) {
      setError(err.message);
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

        <header className="mb-10">
          <h1 className="type-page-title mb-2">Bantuan</h1>
          <p className="text-gray-500 text-sm">FAQ dan dukungan dari server</p>
        </header>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}
        {ticketMsg && (
          <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">{ticketMsg}</p>
        )}

        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Cari bantuan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 py-4 pl-12 pr-6 rounded-2xl shadow-sm text-sm"
          />
        </div>

        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#1A3022] mb-6">Pertanyaan Umum</h2>
          {loading && <p className="text-gray-400 text-sm">Memuat…</p>}
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                  className="w-full p-5 flex justify-between items-center text-left hover:bg-gray-50"
                >
                  <span className="font-bold text-[#1A3022] text-sm">{f.question}</span>
                  <span className="text-gray-400">{expanded === f.id ? '▲' : '▼'}</span>
                </button>
                {expanded === f.id && (
                  <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{f.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="bg-[#1A3022] rounded-[32px] p-8 text-white">
          <h3 className="text-xl font-bold mb-2">Butuh Bantuan Lebih Lanjut?</h3>
          <p className="text-green-100/70 text-sm mb-8">Kirim tiket support dan tim kami akan membalas via email</p>
          <button
            type="button"
            onClick={() => setTicketOpen(true)}
            className="w-full bg-white text-[#1A3022] py-4 rounded-xl font-bold text-sm"
          >
            Email Support
          </button>
        </div>

        {ticketOpen && (
          <form onSubmit={handleTicket} className="mt-8 bg-white rounded-2xl border p-6 space-y-4">
            <h3 className="font-bold text-[#1A3022]">Kirim Tiket</h3>
            <input
              required
              placeholder="Subjek"
              value={ticket.subject}
              onChange={(e) => setTicket((t) => ({ ...t, subject: e.target.value }))}
              className="w-full border rounded-xl px-4 py-3 text-sm"
            />
            <textarea
              required
              minLength={10}
              placeholder="Pesan (min. 10 karakter)"
              value={ticket.message}
              onChange={(e) => setTicket((t) => ({ ...t, message: e.target.value }))}
              className="w-full border rounded-xl px-4 py-3 h-32 text-sm"
            />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-[#1A3022] text-white py-3 rounded-xl font-bold text-sm">
                Kirim
              </button>
              <button type="button" onClick={() => setTicketOpen(false)} className="flex-1 border py-3 rounded-xl text-sm font-bold">
                Tutup
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HelpPage;
