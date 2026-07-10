import React, { useState } from 'react';
import { api } from '../api';

export default function LoginPage({ onLogin }) {
  const [tab, setTab]           = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.login({ username: username.trim(), password });
      localStorage.setItem('token',    data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const data = await api.register({ username: username.trim(), password });
      setSuccess(data.message);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full text-sm border border-rule rounded-lg px-3 py-2.5 bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-seal text-right placeholder:text-inkSoft';

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-display font-bold text-3xl tracking-tight mb-1">
            <span className="text-seal">متابعة</span> الزيارات
          </div>
          <div className="text-xs text-inkSoft">نظام تتبع الزيارات الميدانية</div>
        </div>

        {/* Card */}
        <div className="bg-paperRaised border border-rule rounded-2xl p-6 shadow-sm">
          {/* Tabs */}
          <div className="flex mb-5 bg-paper rounded-lg p-1 gap-1">
            {[
              { id: 'login',    label: 'تسجيل الدخول' },
              { id: 'register', label: 'حساب جديد' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(null); setSuccess(null); }}
                className={`flex-1 text-sm font-semibold py-2 rounded-md transition-colors ${
                  tab === t.id
                    ? 'bg-paperRaised text-ink shadow-sm border border-rule'
                    : 'text-inkSoft hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-inkSoft mb-1 text-right">اسم المستخدم</label>
              <input
                className={inputClass}
                placeholder="اكتب اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-inkSoft mb-1 text-right">كلمة السر</label>
              <input
                className={inputClass}
                placeholder="اكتب كلمة السر"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error   && <div className="text-flag text-sm bg-flag/10 rounded-lg px-3 py-2 text-right">{error}</div>}
            {success && <div className="text-seal text-sm bg-seal/10 rounded-lg px-3 py-2 text-right">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold text-sm bg-seal text-white rounded-lg px-4 py-2.5 hover:bg-[#185950] disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? 'جاري التحميل…' : tab === 'login' ? 'دخول' : 'تسجيل'}
            </button>
          </form>

        
        </div>
      </div>
    </div>
  );
}
