import Layout from '@/Components/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, Home, ShieldAlert, CheckCircle } from 'lucide-react';

export default function Dashboard({ stats, barangay_data, damage_data, top_vulnerable }) {
    const statCards = [
        { title: 'Total Households',  value: stats.total_households, icon: Home,        color: 'bg-gray-900' },
        { title: 'Total Persons',     value: stats.total_persons,    icon: Users,       color: 'bg-gray-700' },
        { title: 'Validated Records', value: stats.validated,        icon: CheckCircle, color: 'bg-emerald-600' },
        { title: 'Totally Damaged',   value: stats.total_damage,     icon: ShieldAlert, color: 'bg-red-600' },
    ];

    const COLORS = ['#111827', '#374151', '#9ca3af'];

    return (
        <Layout>
            <div className="space-y-6">

                {/* Page Title */}
                <div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Dashboard</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Overview — Municipality of Barbaza, Antique
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map(card => (
                        <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                            <div className={`${card.color} p-3 rounded-lg text-white shrink-0`}>
                                <card.icon size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{card.title}</p>
                                <p className="text-2xl font-black text-gray-900 mt-0.5">{card.value.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shelter Damage</p>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-6">Breakdown by Category</h3>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={damage_data}
                                        cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {damage_data.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none', fontSize: '11px', fontWeight: 700 }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Records</p>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-6">By Barangay</h3>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barangay_data} barSize={16}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }}
                                        axisLine={false} tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }}
                                        axisLine={false} tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none', fontSize: '11px', fontWeight: 700 }}
                                    />
                                    <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Vulnerable */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">VAI Index</p>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">High Priority Households</h3>
                        </div>
                        <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                            Action Required
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-200">
                                    <th className="px-6 py-3 text-left">Household Head</th>
                                    <th className="px-6 py-3 text-left">Barangay</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Damage</th>
                                    <th className="px-6 py-3 text-center">VAI Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {top_vulnerable.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3.5 font-black text-gray-900 text-sm">{r.last_name}, {r.first_name}</td>
                                        <td className="px-6 py-3.5 text-sm font-bold text-gray-500">{r.barangay}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider
                                                ${r.status === 'Validated'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-gray-100 text-gray-600'}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider
                                                ${r.shelter_damage === 'Totally Damaged'   ? 'bg-red-50 text-red-700 border border-red-200' :
                                                  r.shelter_damage === 'Partially Damaged' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                  'bg-gray-100 text-gray-500'}`}>
                                                {r.shelter_damage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-20 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-gray-900 h-full rounded-full" style={{ width: `${Math.min(r.vai_score, 100)}%` }} />
                                                </div>
                                                <span className="font-black text-gray-900 text-sm w-6 text-right">{r.vai_score}</span>
                                            </div>
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