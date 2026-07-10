import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import * as XLSX from 'xlsx';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' });
}

function calcAge(dobStr) {
  if (!dobStr) return '';
  const today = new Date();
  const dob   = new Date(dobStr);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

const EMPTY_FORM = {
  fullName: '',
  dateOfBirth: '',
  age: '',
  education: '',
  job: '',
  fatherOfConfession: '',
  phone: '',
  maritalStatus: '',
  neighborhood: '',
  visitNotes: '',
};

export default function Dashboard({ authUser }) {
  const [people, setPeople] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setError(null);
    try {
      const peopleData = await api.getAllPeople();
      setPeople(peopleData);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function field(key, placeholder, type = 'text', extra = {}) {
    return (
      <input
        className="text-sm border border-rule rounded-md px-2.5 py-2 bg-paper flex-1 min-w-[140px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-seal text-right"
        placeholder={placeholder}
        type={type}
        required
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        {...extra}
      />
    );
  }

  async function handleAdd(e) {
    e.preventDefault();
    // Client-side guards (backend also validates)
    const nameVal = form.fullName.trim();
    const ageNum  = Number(form.age);
    if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(nameVal)) {
      setError('الاسم يجب أن يحتوي على حروف فقط بدون أرقام أو رموز');
      return;
    }
    if (ageNum < 17 || ageNum > 30) {
      setError('السن يجب أن يكون بين 17 و 30 سنة');
      return;
    }
    try {
      await api.createPerson({
        fullName: form.fullName.trim(),
        dateOfBirth: form.dateOfBirth,
        age: Number(form.age),
        education: form.education.trim(),
        job: form.job.trim(),
        fatherOfConfession: form.fatherOfConfession.trim(),
        phone: form.phone.trim(),
        maritalStatus: form.maritalStatus,
        neighborhood: form.neighborhood.trim(),
        visitNotes: form.visitNotes.trim(),
      });
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function exportToExcel() {
    const rows = people.map((p) => ({
      'الاسم الكامل':       p.fullName,
      'تاريخ الميلاد':      p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('ar-EG') : '',
      'السن':               p.age,
      'التعليم':            p.education,
      'الوظيفة':            p.job,
      'أب الاعتراف':        p.fatherOfConfession,
      'التليفون':           p.phone,
      'الحالة الاجتماعية': p.maritalStatus,
      'المنطقة':            p.neighborhood,
      'ملاحظات الزيارة':   p.visitNotes,
      'عدد الزيارات':      (p.visitLogs || []).length,
      'آخر زيارة':          p.lastVisitedAt ? new Date(p.lastVisitedAt).toLocaleDateString('ar-EG') : '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الأشخاص');
    XLSX.writeFile(wb, `زيارات-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  const isAdmin = authUser?.role === 'admin';

  const TABLE_HEADERS = [
    'الاسم الكامل', 'تاريخ الميلاد', 'السن', 'التعليم',
    'الوظيفة', 'أب الاعتراف', 'التليفون', 'الحالة الاجتماعية', 'عدد الزيارات', 'آخر زيارة',
    ...(isAdmin ? [''] : []),
  ];

  async function handleDelete(e, id) {
    e.stopPropagation();
    if (!window.confirm('هتمسح السجل ده؟')) return;
    try {
      await api.deletePerson(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 pt-4 pb-14">
      <div>
        <div className="font-display font-bold mb-2.5 flex items-center gap-2">
          الأشخاص <span className="font-mono text-[11px] text-inkSoft font-normal">{people.length} إجمالي</span>
          {isAdmin && (
            <button
              onClick={exportToExcel}
              disabled={people.length === 0}
              className="mr-auto text-xs font-semibold bg-seal text-white rounded-md px-3 py-1.5 hover:bg-[#185950] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ↓ تصدير Excel
            </button>
          )}
        </div>

        {error && <div className="text-flag text-sm mb-2">{error}</div>}

        {/* ── نموذج إضافة شخص ── */}
        <form onSubmit={handleAdd} className="bg-paperRaised border border-rule rounded-[10px] p-3.5 mb-5">
          <div className="flex flex-wrap gap-2">
            {field('fullName', 'الاسم الكامل', 'text', {
              pattern: '[\u0600-\u06FFa-zA-Z\u0020]+',
              title: 'حروف فقط — بدون أرقام أو رموز',
            })}
            <input
              className="text-sm border border-rule rounded-md px-2.5 py-2 bg-paper flex-1 min-w-[140px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-seal"
              placeholder="تاريخ الميلاد"
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(e) => {
                const dob = e.target.value;
                setForm({ ...form, dateOfBirth: dob, age: calcAge(dob) });
              }}
            />
            {/* السن — محسوب تلقائياً من تاريخ الميلاد */}
            <input
              className="text-sm border border-rule rounded-md px-2.5 py-2 bg-paperRaised w-[80px] text-center text-inkSoft cursor-default"
              placeholder="السن"
              type="number"
              readOnly
              value={form.age}
              title="السن محسوب تلقائياً من تاريخ الميلاد"
            />
            {field('education',         'التعليم')}
            {field('job',               'الوظيفة')}
            {field('fatherOfConfession','أب الاعتراف')}
            {field('phone',             'التليفون')}
            <select
              className="text-sm border border-rule rounded-md px-2.5 py-2 bg-paper flex-1 min-w-[140px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-seal text-right"
              required
              value={form.maritalStatus}
              onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
            >
              <option value="" disabled>الحالة الاجتماعية</option>
              <option value="أعزب">أعزب / عزباء</option>
              <option value="متجوز">متجوز / متجوزة</option>
              <option value="مطلق">مطلق / مطلقة</option>
              <option value="أرمل">أرمل / أرملة</option>
            </select>
            {field('neighborhood',      'المنطقة')}
          </div>
          <div className="mt-2 flex gap-2">
            <textarea
              className="text-sm border border-rule rounded-md px-2.5 py-2 bg-paper flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-seal resize-none min-h-[38px] text-right"
              placeholder="ملاحظات عن الزيارة (اختياري)…"
              rows={2}
              value={form.visitNotes}
              onChange={(e) => setForm({ ...form, visitNotes: e.target.value })}
            />
            <button
              type="submit"
              className="font-semibold text-sm bg-ink text-white rounded-md px-4 py-2 hover:bg-[#171009] self-end"
            >
              إضافة
            </button>
          </div>
        </form>

        {/* ── جدول الأشخاص ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {TABLE_HEADERS.map((h, i) => (
                  <th
                    key={i}
                    className="text-right font-semibold text-[11px] text-inkSoft border-b border-rule py-1.5 px-2 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.length === 0 && (
                <tr>
                  <td colSpan={TABLE_HEADERS.length} className="text-center py-8 text-inkSoft text-sm">
                    ما فيش أشخاص لسه، ابدأ بالإضافة فوق.
                  </td>
                </tr>
              )}
              {people.map((p) => (
                <React.Fragment key={p._id}>
                  <tr
                    className="hover:bg-paperRaised cursor-pointer"
                    onClick={() => setExpandedId(expandedId === p._id ? null : p._id)}
                  >
                    <td className="py-2.5 px-2 border-b border-rule align-top font-medium">{p.fullName}</td>
                    <td className="py-2.5 px-2 border-b border-rule align-top whitespace-nowrap">{fmtDate(p.dateOfBirth)}</td>
                    <td className="py-2.5 px-2 border-b border-rule align-top">{p.age}</td>
                    <td className="py-2.5 px-2 border-b border-rule align-top">{p.education}</td>
                    <td className="py-2.5 px-2 border-b border-rule align-top">{p.job || '—'}</td>
                    <td className="py-2.5 px-2 border-b border-rule align-top">{p.fatherOfConfession || '—'}</td>
                    <td className="py-2.5 px-2 border-b border-rule align-top">
                      {p.phone ? (
                        <a href={`tel:${p.phone}`} className="text-seal hover:underline" onClick={(e) => e.stopPropagation()}>
                          {p.phone}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="py-2.5 px-2 border-b border-rule align-top">{p.maritalStatus || '—'}</td>
                    <td className="py-2.5 px-2 border-b border-rule align-top text-center">
                      <span className="text-[11px] font-bold bg-seal/10 text-seal rounded-full px-2 py-0.5">
                        {(p.visitLogs || []).length}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 border-b border-rule align-top whitespace-nowrap">{fmtDate(p.lastVisitedAt)}</td>
                    {isAdmin && (
                      <td className="py-2.5 px-1 border-b border-rule align-top">
                        <button
                          onClick={(e) => handleDelete(e, p._id)}
                          className="text-flag hover:text-red-700 font-bold px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                          title="حذف السجل"
                        >
                          ×
                        </button>
                      </td>
                    )}
                  </tr>

                  {/* صف التفاصيل الموسّع */}
                  {expandedId === p._id && (
                    <tr className="bg-paperRaised">
                      <td colSpan={TABLE_HEADERS.length} className="px-4 py-3 border-b border-rule">

                        {/* ملاحظات الشخص */}
                        {p.visitNotes && (
                          <div className="text-[12.5px] text-inkSoft mb-3 pb-3 border-b border-rule">
                            <span className="font-semibold text-ink">ملاحظات: </span>{p.visitNotes}
                          </div>
                        )}

                        {/* سجل الزيارات */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] font-bold text-ink uppercase tracking-wide">سجل الزيارات</span>
                          <span className="text-[10px] bg-seal text-white font-bold rounded-full px-2 py-0.5">
                            {(p.visitLogs || []).length}
                          </span>
                        </div>

                        {(p.visitLogs || []).length === 0 && (
                          <div className="text-[12.5px] text-inkSoft py-2">ما فيش زيارات مسجلة لسه.</div>
                        )}

                        <div className="space-y-2">
                          {(p.visitLogs || [])
                            .slice()
                            .reverse()
                            .map((log, i, arr) => (
                              <div key={i} className="flex gap-3 items-start text-[12.5px]">
                                {/* رقم الزيارة */}
                                <span className="shrink-0 w-5 h-5 rounded-full bg-seal/20 text-seal font-bold text-[10px] flex items-center justify-center mt-0.5">
                                  {arr.length - i}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-center">
                                    <span className="font-semibold text-ink">{fmtDate(log.visitDate)}</span>
                                    <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                                      log.type === 'اتصال'
                                        ? 'bg-gold/30 text-[#7A5A1E]'
                                        : 'bg-seal/10 text-seal'
                                    }`}>
                                      {log.type === 'اتصال' ? '📞 اتصال' : '🏠 زيارة'}
                                    </span>
                                    <span className="text-inkSoft">بواسطة: <span className="text-ink">{log.visitedBy}</span></span>
                                  </div>
                                  {log.notes && (
                                    <div className="text-inkSoft mt-0.5 italic">{log.notes}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
