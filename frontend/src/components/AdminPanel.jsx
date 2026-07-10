import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';

const STATUS_AR = { pending: 'في الانتظار', approved: 'مفعّل' };
const ROLE_AR   = { user: 'خادم', admin: 'مشرف' };

export default function AdminPanel() {
  const [users, setUsers]   = useState([]);
  const [error, setError]   = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending'

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleApprove(id) {
    try {
      await api.approveUser(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id, username) {
    if (!window.confirm(`هتحذف حساب "${username}"؟`)) return;
    try {
      await api.deleteUser(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const displayed = filter === 'pending'
    ? users.filter((u) => u.status === 'pending')
    : users;

  const pendingCount = users.filter((u) => u.status === 'pending').length;

  return (
    <div className="max-w-3xl mx-auto px-5 pt-4 pb-14">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="font-display font-bold">إدارة المستخدمين</span>
        {pendingCount > 0 && (
          <span className="text-[11px] bg-gold/30 text-[#7A5A1E] font-bold rounded-full px-2.5 py-0.5">
            {pendingCount} في الانتظار
          </span>
        )}
        <div className="mr-auto flex gap-1 bg-paper border border-rule rounded-lg p-1">
          {[['all', 'الكل'], ['pending', 'في الانتظار']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                filter === val ? 'bg-paperRaised text-ink border border-rule shadow-sm' : 'text-inkSoft hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="text-flag text-sm mb-3">{error}</div>}

      {displayed.length === 0 && (
        <div className="text-center py-12 text-inkSoft text-sm">
          {filter === 'pending' ? 'ما فيش طلبات في الانتظار.' : 'ما فيش مستخدمين.'}
        </div>
      )}

      <div className="space-y-2">
        {displayed.map((u) => (
          <div
            key={u._id}
            className="flex items-center gap-3 bg-paperRaised border border-rule rounded-xl px-4 py-3"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-seal/20 text-seal font-bold text-sm flex items-center justify-center shrink-0">
              {u.username[0].toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{u.username}</div>
              <div className="flex gap-2 mt-0.5 flex-wrap">
                <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                  u.role === 'admin'
                    ? 'bg-seal/20 text-seal'
                    : 'bg-ink/10 text-inkSoft'
                }`}>
                  {ROLE_AR[u.role]}
                </span>
                <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                  u.status === 'pending'
                    ? 'bg-gold/30 text-[#7A5A1E]'
                    : 'bg-seal/10 text-seal'
                }`}>
                  {STATUS_AR[u.status]}
                </span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              {u.status === 'pending' && (
                <button
                  onClick={() => handleApprove(u._id)}
                  className="text-xs font-semibold bg-seal text-white rounded-lg px-3 py-1.5 hover:bg-[#185950] transition-colors"
                >
                  موافقة ✓
                </button>
              )}
              {u.role !== 'admin' && (
                <button
                  onClick={() => handleDelete(u._id, u.username)}
                  className="text-xs font-semibold text-flag hover:bg-red-50 border border-flag/30 rounded-lg px-3 py-1.5 transition-colors"
                >
                  حذف
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
