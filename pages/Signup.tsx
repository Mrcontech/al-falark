
import React, { useState } from 'react';
import { useAuth } from '../lib/auth';

const Signup: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { signupAsUser } = useAuth();
  const [formData, setFormData] = useState({
    institution: '',
    jurisdiction: 'United Arab Emirates',
    representative: '',
    email: '',
    allocation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<{ id: string, key: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signupAsUser(formData.institution, formData.email);
      setCredentials({ id: res.encryptedId, key: res.privateKey });
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (credentials) {
    return (
      <div className="min-h-screen bg-novarc-dark flex items-center justify-center p-6 relative overflow-hidden text-white">
        <div className="w-full max-w-xl bg-white/5 border border-white/10 p-12 rounded-sm text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-light tracking-tight mb-4">Account Provisioned</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-12">Save your sovereign credentials immediately</p>

          <div className="space-y-6 text-left mb-12">
            <div className="bg-black/40 p-6 border border-white/5 space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Encrypted ID</label>
              <div className="text-lg font-mono tracking-wider break-all">{credentials.id}</div>
            </div>
            <div className="bg-black/40 p-6 border border-white/5 space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Private Key</label>
              <div className="text-lg font-mono tracking-wider break-all">{credentials.key}</div>
            </div>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/20 p-4 mb-10">
            <p className="text-[10px] text-rose-400 uppercase tracking-widest leading-relaxed font-bold">
              Warning: These credentials cannot be recovered. Download or store them in a secure vault now.
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full bg-novarc-accent text-white py-5 text-[11px] uppercase tracking-[0.5em] font-bold hover:brightness-110 transition-all"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-novarc-dark flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-2xl relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-sm shadow-2xl">
        <div className="flex justify-between items-start mb-12">
          <div>
            <div
              className="flex items-center gap-3 mb-6 cursor-pointer"
              onClick={() => onNavigate('landing')}
            >
              <svg viewBox="0 0 100 100" className="w-8 h-8 fill-novarc-accent">
                <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="15" />
              </svg>
              <span className="text-lg font-bold tracking-[0.3em] text-white">AL-FALAK</span>
            </div>
            <h1 className="text-white text-3xl font-light tracking-tight">Institutional Application</h1>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-2">Begin your sovereign investment journey</p>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="text-[10px] uppercase tracking-widest text-novarc-accent border border-novarc-accent/30 px-6 py-2 hover:bg-novarc-accent hover:text-white transition-all font-bold"
          >
            Log In
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 mb-8 text-rose-500 text-[10px] uppercase tracking-widest text-center font-bold">
            {error}
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Institution Name</label>
            <input
              required
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none rounded-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Jurisdiction</label>
            <select
              value={formData.jurisdiction}
              onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-white/50 text-sm focus:border-novarc-accent outline-none rounded-sm appearance-none"
            >
              <option>United Arab Emirates</option>
              <option>United Kingdom</option>
              <option>Singapore</option>
              <option>United States</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Contact Representative</label>
            <input
              required
              type="text"
              value={formData.representative}
              onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
              className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none rounded-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Institutional Email</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none rounded-sm"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Planned Allocation (USD)</label>
            <input
              required
              type="text"
              placeholder="$10,000,000 +"
              value={formData.allocation}
              onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
              className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none rounded-sm"
            />
          </div>

          <div className="md:col-span-2 py-6">
            <label className="flex items-start gap-4 text-[10px] text-white/40 tracking-widest leading-relaxed cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="mt-1 accent-novarc-accent" required />
              <span>I hereby certify that all information provided is accurate and representative of the named institution. I acknowledge that Al-Falak Capital operates under the Royal Decree of Abu Dhabi and adheres to strict sovereign compliance protocols.</span>
            </label>
          </div>

          <button
            disabled={loading}
            className="md:col-span-2 bg-novarc-accent text-white py-5 text-[11px] uppercase tracking-[0.5em] font-bold hover:brightness-110 transition-all shadow-2xl disabled:opacity-50"
          >
            {loading ? 'Processing Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
