import Layout from '@/Components/Layout';
import { useForm, router } from '@inertiajs/react';
import { UserPlus, Trash2, Shield, MapPin, X } from 'lucide-react';
import { useState } from 'react';

const BARANGAYS = ['Binangbang','Cadiao','Capuyas','Esparar','Guintas','Ipil','Jinalinan','Luntao','Magtulis','Mayabay','Nalupa','Poblacion'];

const inputClass = 'w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-900 text-gray-900 placeholder-gray-300 rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none transition-all';
const labelClass = 'block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5';

export default function UserManagement({ accounts }) {
    const [adding, setAdding] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        role:                  'Barangay Staff',
        assigned_barangay:     '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => { reset(); setAdding(false); }
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this account?')) return;
        router.delete(route('users.destroy', id));
    };

    return (
        <Layout>
            <div className="space-y-6">

                {/* Page Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">User Management</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            Manage LGU Staff System Access
                        </p>
                    </div>
                    <button
                        onClick={() => setAdding(!adding)}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shrink-0"
                    >
                        <UserPlus size={14} />
                        <span>New Account</span>
                    </button>
                </div>

                {/* Add Form */}
                {adding && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 relative">
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Admin Action</p>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Create New Account</h4>
                            </div>
                            <button
                                onClick={() => setAdding(false)}
                                className="text-gray-300 hover:text-gray-900 transition-colors p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="h-px w-full bg-gray-100 mb-5" />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input value={data.name} onChange={e => setData('name', e.target.value)}
                                        placeholder="Juan Dela Cruz" className={inputClass} />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className={labelClass}>Email Address</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                        placeholder="user@barbaza.gov.ph" className={inputClass} />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className={labelClass}>Role</label>
                                    <select value={data.role} onChange={e => setData('role', e.target.value)} className={inputClass}>
                                        <option value="Barangay Staff">Barangay Staff</option>
                                        <option value="MSWDO / Admin">MSWDO / Admin</option>
                                    </select>
                                </div>

                                {data.role === 'Barangay Staff' && (
                                    <div>
                                        <label className={labelClass}>Assigned Barangay</label>
                                        <select value={data.assigned_barangay} onChange={e => setData('assigned_barangay', e.target.value)} className={inputClass}>
                                            <option value="">Select Barangay</option>
                                            {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        {errors.assigned_barangay && <p className="text-red-500 text-xs mt-1">{errors.assigned_barangay}</p>}
                                    </div>
                                )}

                                <div>
                                    <label className={labelClass}>Password</label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••" className={inputClass} />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className={labelClass}>Confirm Password</label>
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••" className={inputClass} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <button type="submit" disabled={processing}
                                    className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                                    {processing ? 'Creating...' : 'Create Account'}
                                </button>
                                <button type="button" onClick={() => setAdding(false)}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-black text-xs uppercase tracking-widest transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Accounts Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Registered</p>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">System Accounts</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50 border-b border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <tr>
                                    <th className="px-6 py-3.5 text-left">Name</th>
                                    <th className="px-6 py-3.5 text-left">Email</th>
                                    <th className="px-6 py-3.5 text-left">Role</th>
                                    <th className="px-6 py-3.5 text-left">Barangay</th>
                                    <th className="px-6 py-3.5 text-left">Created</th>
                                    <th className="px-6 py-3.5 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {accounts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-gray-300 font-black uppercase tracking-widest text-xs">
                                            No accounts found
                                        </td>
                                    </tr>
                                ) : accounts.map(account => (
                                    <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3.5">
                                            <span className="font-black text-gray-900 text-sm block truncate max-w-[180px]">
                                                {account.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className="text-sm font-medium text-gray-500 block truncate max-w-[210px]">
                                                {account.email}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider whitespace-nowrap
                                                ${account.role === 'MSWDO / Admin'
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                <Shield size={9} />
                                                <span>{account.role}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            {account.assigned_barangay ? (
                                                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600">
                                                    <MapPin size={12} className="text-gray-400 shrink-0" />
                                                    <span>{account.assigned_barangay}</span>
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 font-bold text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3.5 text-sm font-medium text-gray-400 whitespace-nowrap">
                                            {account.created_at?.split('T')[0]}
                                        </td>
                                        <td className="px-6 py-3.5 text-center">
                                            <button
                                                onClick={() => handleDelete(account.id)}
                                                className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
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