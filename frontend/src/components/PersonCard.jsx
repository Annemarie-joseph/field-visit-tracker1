import React, { useState } from 'react';

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PersonCard({ person, onMarkVisited }) {
  const [notes, setNotes]   = useState('');
  const [stamping, setStamping] = useState(false);
  const [stampLabel, setStampLabel] = useState('');
  const [leaving, setLeaving]   = useState(false);

  function handleMark(type) {
    if (stamping) return;
    setStampLabel(type === 'اتصال' ? '📞 تم الاتصال' : '✓ تمت الزيارة');
    setStamping(true);
    onMarkVisited(person._id, notes, type);
    setTimeout(() => setLeaving(true), 700);
  }

  const details = [
    person.dateOfBirth        && `تاريخ الميلاد: ${fmtDate(person.dateOfBirth)}`,
    person.age != null        && `السن: ${person.age}`,
    person.education          && `التعليم: ${person.education}`,
    person.job                && `الوظيفة: ${person.job}`,
    person.maritalStatus      && `الحالة الاجتماعية: ${person.maritalStatus}`,
    person.fatherOfConfession && `أب الاعتراف: ${person.fatherOfConfession}`,
    person.neighborhood       && `المنطقة: ${person.neighborhood}`,
  ].filter(Boolean);

  return (
    <div
      className={`relative bg-paperRaised border border-rule rounded-[10px] p-4 mb-3 overflow-hidden transition-all duration-500 ${
        leaving ? 'opacity-0 -translate-x-8 max-h-0 py-0 mb-0 border-0' : 'max-h-[520px]'
      }`}
    >
      {/* Stamp overlay */}
      {stamping && (
        <div className="animate-stamp absolute top-3.5 left-4 w-20 h-20 rounded-full border-[3px] border-seal text-seal flex items-center justify-center font-bold text-[11px] text-center leading-tight pointer-events-none bg-paper/80">
          {stampLabel}
        </div>
      )}

      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="font-display font-bold text-lg">{person.fullName}</div>
          <div className="text-xs text-inkSoft mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
            {details.map((d, i) => <span key={i}>{d}</span>)}
            {person.phone && (
              <a href={`tel:${person.phone}`} className="text-seal hover:underline">
                📞 {person.phone}
              </a>
            )}
          </div>
          {person.visitNotes && (
            <div className="mt-1 text-xs text-inkSoft italic">
              ملاحظة: {person.visitNotes}
            </div>
          )}
        </div>
        <span className="font-semibold text-[10.5px] bg-gold/20 text-[#7A5A1E] px-2 py-1 rounded-full whitespace-nowrap shrink-0">
          في الانتظار
        </span>
      </div>

      <textarea
        className="w-full mt-3 text-sm border border-rule rounded-md px-2.5 py-2 bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-seal resize-y min-h-[38px] text-right"
        placeholder="ملاحظات (اختياري)…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={stamping}
      />

      <div className="flex gap-2 mt-2.5">
        <button
          disabled={stamping}
          onClick={() => handleMark('زيارة')}
          className="font-semibold text-sm bg-seal text-white rounded-lg px-4 py-2 hover:bg-[#185950] disabled:opacity-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
        >
          تمت الزيارة ✓
        </button>
        <button
          disabled={stamping}
          onClick={() => handleMark('اتصال')}
          className="font-semibold text-sm border border-seal text-seal rounded-lg px-4 py-2 hover:bg-seal/10 disabled:opacity-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
        >
          تم الاتصال 📞
        </button>
      </div>
    </div>
  );
}
