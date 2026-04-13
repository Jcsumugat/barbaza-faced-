import { useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { ShieldCheck, Mail, Lock, User, ArrowLeft, UserPlus, MapPin } from 'lucide-react';

const BARANGAYS = ['Binangbang','Cadiao','Capuyas','Esparar','Guintas','Ipil','Jinalinan','Luntao','Magtulis','Mayabay','Nalupa','Poblacion'];

const inputClass = 'w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-900 text-gray-900 placeholder-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none transition-all';
const labelClass = 'block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2';

export default function RegisterStaff() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'Barangay Staff',
        assigned_barangay: '',
    });

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

            {/* Top accent bar */}
            <div className="h-1 w-full bg-gray-900 shrink-0" />

            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <ShieldCheck size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none">Barbaza FACED</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">MSWDO Portal</p>
                        </div>
                    </div>
                    <Link
                        href={route('login.staff')}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft size={13} />
                        <span>Back to Staff Login</span>
                    </Link>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-sm">

                    {/* Role badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                            <UserPlus size={14} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none">Barangay Staff</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">New Account Registration</p>
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none mb-1">
                        Create Account
                    </h1>
                    <p className="text-xs text-gray-400 mb-8">
                        Register a new Barangay Staff account. You will be assigned to a specific barangay upon approval.
                    </p>

                    {/* Divider */}
                    <div className="h-px w-full bg-gray-200 mb-8" />

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Full Name */}
                        <div>
                            <label className={labelClass}>Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Juan Dela Cruz"
                                    className={inputClass}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="staff@barbaza.gov.ph"
                                    className={inputClass}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.email}</p>}
                        </div>

                        {/* Assigned Barangay */}
                        <div>
                            <label className={labelClass}>Assigned Barangay</label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                <select
                                    value={data.assigned_barangay}
                                    onChange={e => setData('assigned_barangay', e.target.value)}
                                    className={`${inputClass} appearance-none`}
                                >
                                    <option value="">Select Barangay</option>
                                    {BARANGAYS.map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.assigned_barangay && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.assigned_barangay}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className={labelClass}>Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClass}
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className={labelClass}>Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClass}
                                />
                            </div>
                            {errors.password_confirmation && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.password_confirmation}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {processing ? (
                                <span className="animate-pulse">Creating account...</span>
                            ) : (
                                <span>Create Staff Account</span>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="h-px w-full bg-gray-100" />

                        <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                            Already have an account?{' '}
                            <Link
                                href={route('login.staff')}
                                className="text-gray-900 hover:underline underline-offset-2 font-black transition-colors"
                            >
                                Sign in as Staff →
                            </Link>
                        </p>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} Municipal Government of Barbaza, Antique
                    </p>
                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                        LGU Barbaza · DSWD Region VI · RA 10173
                    </p>
                </div>
            </footer>
        </div>
    );
}