import Layout from '@/Components/Layout';
import { router } from '@inertiajs/react';
import { Filter, Calendar, Printer } from 'lucide-react';
import { useState } from 'react';

const BARANGAYS = ['Binangbang','Cadiao','Capuyas','Esparar','Guintas','Ipil','Jinalinan','Luntao','Magtulis','Mayabay','Nalupa','Poblacion'];
const MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const formatCurrency = (amount) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

const labelClass  = 'block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5';
const selectClass = 'w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-900 rounded-lg pl-9 pr-4 py-2.5 text-sm font-medium text-gray-900 outline-none transition-all appearance-none';

export default function Reports({ records, barangay_stats, summary, filters }) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilter = () => {
        router.get(route('reports.index'), localFilters, { preserveState: true });
    };

    return (
        <Layout>
            <div className="space-y-6">

                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Operational Reports</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            Municipality of Barbaza — FACED Summary
                        </p>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shrink-0"
                    >
                        <Printer size={14} />
                        <span>Print Report</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Filter Report</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                            <label className={labelClass}>Month</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                                <select
                                    value={localFilters.month || ''}
                                    onChange={e => setLocalFilters({ ...localFilters, month: e.target.value })}
                                    className={selectClass}
                                >
                                    <option value="">All Months</option>
                                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Barangay</label>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                                <select
                                    value={localFilters.barangay || ''}
                                    onChange={e => setLocalFilters({ ...localFilters, barangay: e.target.value })}
                                    className={selectClass}
                                >
                                    <option value="">All Barangays</option>
                                    {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Min. VAI Score</label>
                            <input
                                type="number" min="0" max="110"
                                value={localFilters.min_vai || ''}
                                onChange={e => setLocalFilters({ ...localFilters, min_vai: e.target.value })}
                                className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-900 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-900 outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Families',    value: summary.total_families },
                        { label: 'Total Persons',     value: summary.total_persons },
                        { label: 'Total Aid Value',   value: formatCurrency(summary.total_aid) },
                        { label: 'Active Barangays',  value: summary.active_barangays },
                    ].map(item => (
                        <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-xl font-black text-gray-900">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Barangay Summary Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Summary</p>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">By Barangay</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <tr>
                                    <th className="px-6 py-3.5">Barangay</th>
                                    <th className="px-6 py-3.5 text-center">Families</th>
                                    <th className="px-6 py-3.5 text-center">Persons</th>
                                    <th className="px-6 py-3.5 text-center">Totally Damaged</th>
                                    <th className="px-6 py-3.5 text-right">Total Aid</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {barangay_stats.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-300 font-black uppercase tracking-widest text-xs">
                                            No data available
                                        </td>
                                    </tr>
                                ) : barangay_stats.map(b => (
                                    <tr key={b.name} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3.5 font-black text-gray-900 text-sm">{b.name}</td>
                                        <td className="px-6 py-3.5 text-center font-bold text-gray-600 text-sm">{b.families}</td>
                                        <td className="px-6 py-3.5 text-center font-bold text-gray-600 text-sm">{b.persons}</td>
                                        <td className="px-6 py-3.5 text-center">
                                            <span className={`text-sm font-black ${b.totally_damaged > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                {b.totally_damaged}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right font-black text-gray-900 text-sm">{formatCurrency(b.assistance_value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detailed Household Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Detailed</p>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Household Report</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <tr>
                                    <th className="px-6 py-3.5">Household Head</th>
                                    <th className="px-6 py-3.5">Barangay</th>
                                    <th className="px-6 py-3.5 text-center">VAI Score</th>
                                    <th className="px-6 py-3.5 text-center">Shelter</th>
                                    <th className="px-6 py-3.5 text-right">Aid Received</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {records.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-300 font-black uppercase tracking-widest text-xs">
                                            No records found
                                        </td>
                                    </tr>
                                ) : records.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3.5 font-black text-gray-900 text-sm">{r.last_name}, {r.first_name}</td>
                                        <td className="px-6 py-3.5 font-bold text-gray-500 text-sm">{r.barangay}</td>
                                        <td className="px-6 py-3.5 text-center font-black text-gray-900 text-sm">{r.vai_score}</td>
                                        <td className="px-6 py-3.5 text-center">
                                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider
                                                ${r.shelter_damage === 'Totally Damaged'    ? 'bg-red-50 text-red-700 border border-red-200' :
                                                  r.shelter_damage === 'Partially Damaged'  ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                  'bg-gray-100 text-gray-500'}`}>
                                                {r.shelter_damage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right font-black text-gray-900 text-sm">{formatCurrency(r.total_aid)}</td>
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