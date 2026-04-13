import { useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { ShieldCheck, Mail, Lock, LogIn, ArrowLeft, UserPlus } from 'lucide-react';

export default function LoginStaff({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => reset('password');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'));
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
                        href={route('welcome')}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft size={13} />
                        <span>Back to Portal</span>
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
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">Barangay Level Access</p>
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none mb-1">
                        Sign In
                    </h1>
                    <p className="text-xs text-gray-400 mb-8">
                        Household profiling and assistance encoding for your assigned barangay.
                    </p>

                    {/* Divider */}
                    <div className="h-px w-full bg-gray-200 mb-8" />

                    {/* Status */}
                    {status && (
                        <div className="mb-6 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold uppercase tracking-widest">
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    autoComplete="username"
                                    placeholder="staff@barbaza.gov.ph"
                                    className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-900 text-gray-900 placeholder-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none transition-all"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs font-bold mt-1.5">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-900 text-gray-900 placeholder-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none transition-all"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs font-bold mt-1.5">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-gray-900 accent-gray-900"
                                />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                                    Remember me
                                </span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-gray-400 hover:text-gray-900 font-bold uppercase tracking-wider transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {processing ? (
                                <span className="animate-pulse">Signing in...</span>
                            ) : (
                                <>
                                    <LogIn size={14} />
                                    <span>Sign In as Barangay Staff</span>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="h-px w-full bg-gray-100" />

                        <div className="flex flex-col gap-1.5 text-center">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                No account yet?{' '}
                                <Link
                                    href={route('register.staff')}
                                    className="text-gray-900 hover:underline underline-offset-2 font-black transition-colors"
                                >
                                    Register here →
                                </Link>
                            </p>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                Not a staff?{' '}
                                <Link
                                    href={route('login')}
                                    className="text-gray-900 hover:underline underline-offset-2 font-black transition-colors"
                                >
                                    MSWDO / Admin login →
                                </Link>
                            </p>
                        </div>
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