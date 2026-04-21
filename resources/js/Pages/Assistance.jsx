import Layout from '@/Components/Layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Plus, CheckCircle, Lock, Trash2, Printer, ChevronLeft,
    User, Users, ShieldAlert, Banknote, Home, FileText,
    X, AlertTriangle, BadgeCheck, Clock, Search
} from 'lucide-react';
import { useState } from 'react';

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (v) => v ?? '—';
const fmtCurrency = (n) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n ?? 0);
const fmtDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' });
};

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        'Pending Approval': { icon: Clock,        bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700'  },
        'Approved':         { icon: BadgeCheck,    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700'},
        'Locked':           { icon: Lock,          bg: 'bg-gray-100',   border: 'border-gray-300',    text: 'text-gray-600'   },
        'Submitted':        { icon: Clock,         bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700'   },
        'Returned':         { icon: AlertTriangle, bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700'    },
        'Validated':        { icon: BadgeCheck,    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700'},
    };
    const cfg = map[status] ?? map['Pending Approval'];
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
            <Icon size={10} />
            {status}
        </span>
    );
}

// ─── Shelter damage badge ─────────────────────────────────────────────────────
function ShelterBadge({ damage }) {
    const map = {
        'None':              'bg-gray-100 text-gray-500 border-gray-200',
        'Partially Damaged': 'bg-amber-50 text-amber-700 border-amber-200',
        'Totally Damaged':   'bg-red-50 text-red-700 border-red-200',
    };
    return (
        <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${map[damage] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
            {damage}
        </span>
    );
}

// ─── VAI Score ring ───────────────────────────────────────────────────────────
function VaiRing({ score }) {
    const pct  = Math.min(score / 110, 1);
    const r    = 20;
    const circ = 2 * Math.PI * r;
    const dash = pct * circ;
    const color = score >= 70 ? '#dc2626' : score >= 40 ? '#d97706' : '#16a34a';
    return (
        <div className="flex flex-col items-center gap-0.5">
            <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle
                    cx="26" cy="26" r={r} fill="none"
                    stroke={color} strokeWidth="4"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    transform="rotate(-90 26 26)"
                />
                <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="800" fill={color}>{score}</text>
            </svg>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">VAI</span>
        </div>
    );
}

// ─── Add Assistance Modal ─────────────────────────────────────────────────────
function AddAssistanceModal({ record, members, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        recipient_member_id: '',
        recipient_name:      `${record.last_name}, ${record.first_name}`,
        date:                new Date().toISOString().slice(0, 10),
        emergency_type:      '',
        assistance_provided: '',
        unit:                'Pack',
        quantity:            1,
        cost:                0,
        provider:            'LGU Barbaza',
    });

    const recipientOptions = [
        { value: '', label: `${record.last_name}, ${record.first_name} (Head)` },
        ...(members ?? []).map(m => ({ value: m.id, label: `${m.name} (${m.relationship})` })),
    ];

    const handleRecipientChange = (e) => {
        const val = e.target.value;
        const chosen = recipientOptions.find(o => o.value === val);
        setData(d => ({
            ...d,
            recipient_member_id: val,
            recipient_name: chosen ? chosen.label.split(' (')[0] : d.recipient_name,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('assistance.store', record.id), {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    const inputCls = (field) =>
        `w-full bg-white border ${errors[field] ? 'border-red-400' : 'border-gray-200'} hover:border-gray-300 focus:border-gray-900 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-900 outline-none transition-all`;

    const labelCls = 'block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5';

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Add Assistance Record</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {record.serial_number}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Recipient */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Recipient</label>
                            <select
                                value={data.recipient_member_id}
                                onChange={handleRecipientChange}
                                className={inputCls('recipient_member_id')}
                            >
                                {recipientOptions.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Date</label>
                            <input type="date" value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className={inputCls('date')} />
                            {errors.date && <p className="text-[10px] text-red-500 mt-1">{errors.date}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Emergency / Disaster Type</label>
                            <input type="text" value={data.emergency_type} placeholder="e.g. Typhoon, Flood"
                                onChange={e => setData('emergency_type', e.target.value)}
                                className={inputCls('emergency_type')} />
                            {errors.emergency_type && <p className="text-[10px] text-red-500 mt-1">{errors.emergency_type}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Assistance Provided</label>
                            <input type="text" value={data.assistance_provided} placeholder="e.g. Food Pack, Cash Aid"
                                onChange={e => setData('assistance_provided', e.target.value)}
                                className={inputCls('assistance_provided')} />
                            {errors.assistance_provided && <p className="text-[10px] text-red-500 mt-1">{errors.assistance_provided}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={labelCls}>Unit</label>
                            <select value={data.unit} onChange={e => setData('unit', e.target.value)} className={inputCls('unit')}>
                                {['Pack','Box','Sack','Piece','Set','Bag','Bottle','Roll','Ration','Cash'].map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Quantity</label>
                            <input type="number" min="0" step="0.01" value={data.quantity}
                                onChange={e => setData('quantity', e.target.value)}
                                className={inputCls('quantity')} />
                        </div>
                        <div>
                            <label className={labelCls}>Cost (PHP)</label>
                            <input type="number" min="0" step="0.01" value={data.cost}
                                onChange={e => setData('cost', e.target.value)}
                                className={inputCls('cost')} />
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Provider</label>
                        <input type="text" value={data.provider}
                            onChange={e => setData('provider', e.target.value)}
                            className={inputCls('provider')} />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing}
                            className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                            <Plus size={13} />
                            {processing ? 'Saving…' : 'Add Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── INDEX VIEW (all assistance records, no specific record) ──────────────────
function AssistanceIndex({ assistance_records, summary, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'MSWDO / Admin';

    const [search, setSearch]   = useState(filters?.search ?? '');
    const [month, setMonth]     = useState(filters?.month ?? '');
    const [status, setStatus]   = useState(filters?.status ?? '');

    const applyFilters = () => {
        router.get(route('assistance.index'), { search, month, status }, { preserveState: true });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    return (
        <Layout>
            <Head title="Assistance Records" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">
                            Assistance Records
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            All logged assistance entries
                        </p>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Records', value: summary.total },
                        { label: 'Pending',       value: summary.pending },
                        { label: 'Approved',      value: summary.approved },
                        { label: 'Total Cost',    value: fmtCurrency(summary.total_cost) },
                    ].map(c => (
                        <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{c.label}</p>
                            <p className="text-2xl font-black text-gray-900 mt-1">{c.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[160px]">
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Search</label>
                        <div className="relative">
                            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Recipient, type, assistance…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-8 pr-3.5 py-2.5 border border-gray-200 hover:border-gray-300 focus:border-gray-900 rounded-lg text-sm font-medium text-gray-900 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Month</label>
                        <select
                            value={month}
                            onChange={e => setMonth(e.target.value)}
                            className="border border-gray-200 hover:border-gray-300 focus:border-gray-900 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-900 outline-none transition-all"
                        >
                            <option value="">All Months</option>
                            {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => (
                                <option key={m} value={i + 1}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="border border-gray-200 hover:border-gray-300 focus:border-gray-900 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-900 outline-none transition-all"
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="Approved">Approved</option>
                            <option value="Locked">Locked</option>
                        </select>
                    </div>
                    <button
                        onClick={applyFilters}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                    >
                        Filter
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <tr>
                                    <th className="px-6 py-3.5">Serial #</th>
                                    <th className="px-6 py-3.5">Barangay</th>
                                    <th className="px-6 py-3.5">Recipient</th>
                                    <th className="px-6 py-3.5">Date</th>
                                    <th className="px-6 py-3.5">Emergency Type</th>
                                    <th className="px-6 py-3.5">Assistance</th>
                                    <th className="px-6 py-3.5 text-center">Qty / Unit</th>
                                    <th className="px-6 py-3.5 text-right">Cost</th>
                                    <th className="px-6 py-3.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {assistance_records.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2 text-gray-300">
                                                <ShieldAlert size={28} />
                                                <p className="text-xs font-black uppercase tracking-widest">No assistance records found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : assistance_records.map(a => (
                                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3.5">
                                            <Link
                                                href={route('assistance.show', a.faced_record_id)}
                                                className="font-black text-gray-900 text-xs hover:underline"
                                            >
                                                {a.serial_number ?? '—'}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3.5 font-bold text-gray-500 text-xs">{a.barangay ?? '—'}</td>
                                        <td className="px-6 py-3.5 font-black text-gray-900 text-sm">{a.recipient_name}</td>
                                        <td className="px-6 py-3.5 font-bold text-gray-500 text-xs whitespace-nowrap">{fmtDate(a.date)}</td>
                                        <td className="px-6 py-3.5 font-bold text-gray-600 text-sm">{a.emergency_type}</td>
                                        <td className="px-6 py-3.5 font-bold text-gray-600 text-sm">{a.assistance_provided}</td>
                                        <td className="px-6 py-3.5 text-center font-bold text-gray-600 text-sm whitespace-nowrap">
                                            {a.quantity} {a.unit}
                                        </td>
                                        <td className="px-6 py-3.5 text-right font-black text-gray-900 text-sm whitespace-nowrap">
                                            {fmtCurrency(a.cost)}
                                        </td>
                                        <td className="px-6 py-3.5 text-center">
                                            <StatusBadge status={a.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </Layout>
    );
}

// ─── DETAIL VIEW (single FACED record + its assistance records) ───────────────
function AssistanceDetail({ record, members, assistance_records, can }) {
    const { auth } = usePage().props;
    const isAdmin  = auth.user.role === 'MSWDO / Admin';
    const [showModal, setShowModal] = useState(false);

    const totalAid = assistance_records.reduce((s, a) => s + parseFloat(a.cost ?? 0), 0);

    const handleApprove = (assistanceId) => {
        router.patch(route('assistance.approve', [record.id, assistanceId]), {}, {
            preserveScroll: true,
        });
    };

    const handleLock = (assistanceId) => {
        router.patch(route('assistance.lock', [record.id, assistanceId]), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (assistanceId) => {
        if (!confirm('Delete this assistance record?')) return;
        router.delete(route('assistance.destroy', [record.id, assistanceId]), {
            preserveScroll: true,
        });
    };

    return (
        <Layout>
            <Head title={`${record.serial_number} — Assistance`} />

            <div className="space-y-6">

                {/* ── Breadcrumb & actions ── */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <Link href={route('records.index')}
                            className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
                            <ChevronLeft size={16} />
                        </Link>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">
                                {record.last_name}, {record.first_name} {record.middle_name ?? ''}
                            </h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                {record.serial_number} · Brgy. {record.barangay}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('records.print', record.id)}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 hover:border-gray-400 text-gray-700 rounded-lg font-black text-xs uppercase tracking-widest transition-all"
                        >
                            <Printer size={13} />
                            Print FACED
                        </Link>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-black text-xs uppercase tracking-widest transition-all"
                        >
                            <Plus size={13} />
                            Add Assistance
                        </button>
                    </div>
                </div>

                {/* ── Record overview cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Identity */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                                    <User size={13} className="text-white" />
                                </div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Head of Family</p>
                            </div>
                            <StatusBadge status={record.status} />
                        </div>
                        <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold text-xs">Sex</span>
                                <span className="font-black text-gray-900 text-xs">{fmt(record.sex)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold text-xs">Civil Status</span>
                                <span className="font-black text-gray-900 text-xs">{fmt(record.civil_status)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold text-xs">Birthdate</span>
                                <span className="font-black text-gray-900 text-xs">{fmtDate(record.birthdate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold text-xs">Occupation</span>
                                <span className="font-black text-gray-900 text-xs">{fmt(record.occupation)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold text-xs">Contact</span>
                                <span className="font-black text-gray-900 text-xs">{fmt(record.contact_primary)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Housing & vulnerability */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                                <Home size={13} className="text-white" />
                            </div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Housing & Status</p>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold text-xs">Shelter Damage</span>
                                <ShelterBadge damage={record.shelter_damage} />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold text-xs">Ownership</span>
                                <span className="font-black text-gray-900 text-xs">{fmt(record.house_ownership)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold text-xs">Monthly Income</span>
                                <span className="font-black text-gray-900 text-xs">{fmtCurrency(record.monthly_income)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold text-xs">4Ps / IP</span>
                                <span className="font-black text-gray-900 text-xs">
                                    {[record.is_4ps && '4Ps', record.is_ip && 'IP'].filter(Boolean).join(', ') || 'None'}
                                </span>
                            </div>
                        </div>
                        <div className="pt-2 flex justify-center">
                            <VaiRing score={record.vai_score} />
                        </div>
                    </div>

                    {/* Financial */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                                <Banknote size={13} className="text-white" />
                            </div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Account & Aid</p>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold text-xs">Bank / E-Wallet</span>
                                <span className="font-black text-gray-900 text-xs">{fmt(record.bank_provider)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold text-xs">Account</span>
                                <span className="font-black text-gray-900 text-xs">{fmt(record.account_number)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold text-xs">Type</span>
                                <span className="font-black text-gray-900 text-xs">{fmt(record.account_type)}</span>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Aid Received</p>
                            <p className="text-2xl font-black text-gray-900">{fmtCurrency(totalAid)}</p>
                            <p className="text-[9px] text-gray-400 font-bold mt-0.5">
                                {assistance_records.length} record{assistance_records.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Family members panel ── */}
                {(members ?? []).length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                                <Users size={13} className="text-white" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Family Composition</p>
                                <p className="text-xs font-black text-gray-900 mt-0.5">{members.length} member{members.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Relationship</th>
                                        <th className="px-6 py-3 text-center">Age</th>
                                        <th className="px-6 py-3 text-center">Sex</th>
                                        <th className="px-6 py-3">Occupation</th>
                                        <th className="px-6 py-3">Education</th>
                                        <th className="px-6 py-3">Vulnerabilities</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {members.map(m => (
                                        <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 font-black text-gray-900 text-sm">{m.name}</td>
                                            <td className="px-6 py-3 font-bold text-gray-500 text-xs">{m.relationship}</td>
                                            <td className="px-6 py-3 text-center font-bold text-gray-600 text-sm">{m.age ?? '—'}</td>
                                            <td className="px-6 py-3 text-center font-bold text-gray-600 text-xs">{m.sex}</td>
                                            <td className="px-6 py-3 font-bold text-gray-500 text-xs">{m.occupation ?? '—'}</td>
                                            <td className="px-6 py-3 font-bold text-gray-500 text-xs">{m.educational_attainment ?? '—'}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {(m.vulnerabilities ?? []).length === 0
                                                        ? <span className="text-gray-300 text-xs font-bold">—</span>
                                                        : m.vulnerabilities.map(v => (
                                                            <span key={v} className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                                                                {v}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Assistance records table ── */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                                <FileText size={13} className="text-white" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Assistance Records</p>
                                <p className="text-xs font-black text-gray-900 mt-0.5">
                                    {assistance_records.length} entr{assistance_records.length !== 1 ? 'ies' : 'y'}
                                </p>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="hidden md:flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                            <span className="flex items-center gap-1"><Clock size={9} className="text-amber-500" /> Pending</span>
                            <span className="flex items-center gap-1"><BadgeCheck size={9} className="text-emerald-500" /> Approved</span>
                            <span className="flex items-center gap-1"><Lock size={9} className="text-gray-500" /> Locked</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <tr>
                                    <th className="px-6 py-3.5">Date</th>
                                    <th className="px-6 py-3.5">Recipient</th>
                                    <th className="px-6 py-3.5">Emergency Type</th>
                                    <th className="px-6 py-3.5">Assistance</th>
                                    <th className="px-6 py-3.5 text-center">Qty / Unit</th>
                                    <th className="px-6 py-3.5 text-center">Provider</th>
                                    <th className="px-6 py-3.5 text-right">Cost</th>
                                    <th className="px-6 py-3.5 text-center">Status</th>
                                    {isAdmin && <th className="px-6 py-3.5 text-center">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {assistance_records.length === 0 ? (
                                    <tr>
                                        <td colSpan={isAdmin ? 9 : 8} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2 text-gray-300">
                                                <ShieldAlert size={28} />
                                                <p className="text-xs font-black uppercase tracking-widest">No assistance records yet</p>
                                                <p className="text-[10px] font-bold">Click "Add Assistance" to log the first entry</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : assistance_records.map(a => (
                                    <tr key={a.id} className={`hover:bg-gray-50 transition-colors ${a.status === 'Locked' ? 'opacity-60' : ''}`}>
                                        <td className="px-6 py-3.5 font-bold text-gray-600 text-xs whitespace-nowrap">{fmtDate(a.date)}</td>
                                        <td className="px-6 py-3.5 font-black text-gray-900 text-sm">{a.recipient_name}</td>
                                        <td className="px-6 py-3.5 font-bold text-gray-600 text-sm">{a.emergency_type}</td>
                                        <td className="px-6 py-3.5 font-bold text-gray-600 text-sm">{a.assistance_provided}</td>
                                        <td className="px-6 py-3.5 text-center font-bold text-gray-600 text-sm whitespace-nowrap">
                                            {a.quantity} {a.unit}
                                        </td>
                                        <td className="px-6 py-3.5 text-center font-bold text-gray-500 text-xs">{a.provider ?? '—'}</td>
                                        <td className="px-6 py-3.5 text-right font-black text-gray-900 text-sm whitespace-nowrap">
                                            {fmtCurrency(a.cost)}
                                        </td>
                                        <td className="px-6 py-3.5 text-center">
                                            <StatusBadge status={a.status} />
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {a.status === 'Pending Approval' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(a.id)}
                                                                title="Approve"
                                                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                            >
                                                                <CheckCircle size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(a.id)}
                                                                title="Delete"
                                                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {a.status === 'Approved' && (
                                                        <button
                                                            onClick={() => handleLock(a.id)}
                                                            title="Lock"
                                                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Lock size={14} />
                                                        </button>
                                                    )}
                                                    {a.status === 'Locked' && (
                                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-2">Final</span>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                            {assistance_records.length > 0 && (
                                <tfoot className="bg-gray-50 border-t border-gray-200">
                                    <tr>
                                        <td colSpan={6} className="px-6 py-3.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            Total
                                        </td>
                                        <td className="px-6 py-3.5 text-right font-black text-gray-900 text-sm">
                                            {fmtCurrency(totalAid)}
                                        </td>
                                        <td colSpan={isAdmin ? 2 : 1} />
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>

            </div>

            {/* Add modal */}
            {showModal && (
                <AddAssistanceModal
                    record={record}
                    members={members ?? []}
                    onClose={() => setShowModal(false)}
                />
            )}
        </Layout>
    );
}

// ─── Root export — routes to index or detail view based on props ──────────────
export default function Assistance(props) {
    if (!props.record) {
        return <AssistanceIndex {...props} />;
    }
    return <AssistanceDetail {...props} />;
}