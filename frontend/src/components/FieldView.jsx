import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import PersonCard from './PersonCard.jsx';

const MONTH_AR = [
  'يناير','فبراير','مارس','أبريل','مايو','يونيو',
  'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر',
];

export default function FieldView() {
  const [pending, setPending]   = useState([]);
  const [total,   setTotal]     = useState(0);   // total people this user owns
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  const now         = new Date();
  const monthLabel  = `${MONTH_AR[now.getMonth()]} ${now.getFullYear()}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pendingData, allData] = await Promise.all([
        api.getPending(),
        api.getAllPeople(),
      ]);
      setPending(pendingData);
      setTotal(allData.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleMarkVisited(personId, notes, type) {
    try {
      await api.logVisit({ personId, notes, type });
      // Remove from list immediately after successful log
      setTimeout(() => {
        setPending((prev) => prev.filter((p) => p._id !== personId));
      }, 900);
    } catch (err) {
      setError(err.message);
    }
  }

  const done = total - pending.length;

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-14">

      {/* Monthly progress header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-inkSoft">
          زيارات <span className="text-ink">{monthLabel}</span>
        </div>
        {!loading && total > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-28 bg-rule rounded-full overflow-hidden">
              <div
                className="h-full bg-seal rounded-full transition-all duration-500"
                style={{ width: `${Math.round((done / total) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-inkSoft font-mono">
              {done}/{total}
            </span>
          </div>
        )}
      </div>

      {error   && <div className="text-flag text-sm mb-3">{error}</div>}
      {loading && <div className="text-inkSoft text-sm">جاري التحميل…</div>}

      {!loading && pending.length === 0 && !error && (
        <div className="text-center py-16 text-inkSoft font-display text-lg">
          مفيش زيارات تانية 🌿
        </div>
      )}

      {pending.map((p) => (
        <PersonCard key={p._id} person={p} onMarkVisited={handleMarkVisited} />
      ))}
    </div>
  );
}
