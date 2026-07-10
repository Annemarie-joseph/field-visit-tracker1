import React, { useState } from 'react';
import FieldView  from './components/FieldView.jsx';
import Dashboard  from './components/Dashboard.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import LoginPage  from './components/LoginPage.jsx';

function loadAuth() {
  try {
    const token = localStorage.getItem('token');
    const user  = JSON.parse(localStorage.getItem('authUser') || 'null');
    return token && user ? user : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [authUser, setAuthUser] = useState(loadAuth);
  const [tab, setTab]           = useState('field');

  function handleLogin(user) {
    setAuthUser(user);
    setTab('field');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    setAuthUser(null);
  }

  if (!authUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isAdmin = authUser.role === 'admin';

  const TABS = [
    { id: 'field',  label: 'الزيارات الميدانية' },
    { id: 'ledger', label: 'سجل الأشخاص' },
    ...(isAdmin ? [{ id: 'admin', label: 'إدارة المستخدمين' }] : []),
  ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between px-5 pt-4 pb-3.5 border-b border-rule">
        <div>
          <div className="font-display font-bold text-2xl tracking-tight">
            <span className="text-seal">متابعة</span> الزيارات
          </div>
          <div className="text-xs text-inkSoft mt-0.5">نظام تتبع الزيارات الميدانية</div>
        </div>

        {/* User badge + logout */}
        <div className="flex items-center gap-2.5">
          <div className="text-left">
            <div className="text-sm font-semibold">{authUser.username}</div>
            <div className={`text-[10px] font-bold rounded-full px-2 py-0.5 text-center ${
              isAdmin ? 'bg-seal/20 text-seal' : 'bg-ink/10 text-inkSoft'
            }`}>
              {isAdmin ? 'مشرف' : 'خادم'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-inkSoft border border-rule rounded-lg px-3 py-1.5 hover:bg-paperRaised hover:text-ink transition-colors"
          >
            خروج
          </button>
        </div>
      </header>

      <nav className="flex gap-1 px-5 pt-3.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`font-semibold text-[13px] px-4 py-2.5 rounded-t-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-seal ${
              tab === t.id ? 'bg-paperRaised text-ink' : 'text-inkSoft'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'field'  && <FieldView />}
      {tab === 'ledger' && <Dashboard authUser={authUser} />}
      {tab === 'admin'  && isAdmin && <AdminPanel />}
    </div>
  );
}
