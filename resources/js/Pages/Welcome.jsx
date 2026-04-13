import { Link } from "@inertiajs/react";
import {
    ShieldCheck,
    LogIn,
    UserPlus,
    ShieldAlert,
    ChevronRight,
} from "lucide-react";

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gray-900 shrink-0" />

            {/* Header bar */}
            <header className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <ShieldCheck size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none">
                                Barbaza FACED
                            </p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">
                                MSWDO Portal
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Municipality of Barbaza
                        </span>
                        <div className="h-3 w-px bg-gray-200" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Province of Antique
                        </span>
                        <div className="h-3 w-px bg-gray-200" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Region VI
                        </span>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
                <div className="w-full max-w-2xl">
                    {/* Hero text */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="h-px w-6 bg-gray-300" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                Official Digital System
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-3">
                            Family Assistance Card
                            <br />
                            <span className="text-gray-400">
                                in Emergencies &amp; Disasters
                            </span>
                        </h1>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-md mt-4">
                            A unified household profiling and assistance
                            management platform for Barangay Staff and MSWDO
                            officials of Barbaza, Antique.
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gray-200 mb-8" />

                    {/* Portal label */}
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4">
                        Select your access portal
                    </p>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {/* MSWDO Admin — dark card */}
                        <Link
                            href={route("login")}
                            className="group bg-gray-900 hover:bg-gray-800 border border-gray-900 rounded-xl p-6 transition-all duration-200 flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                                    <ShieldAlert
                                        size={16}
                                        className="text-white"
                                    />
                                </div>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-white/10 px-2 py-1 rounded-md">
                                    Municipal
                                </span>
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1.5">
                                MSWDO / Admin
                            </h3>
                            <p className="text-xs text-gray-400 leading-relaxed mb-5 flex-1">
                                Full validation, approval workflows, SitRep
                                generation, DROMIC encoding, and user
                                management.
                            </p>
                            <div className="flex items-center gap-1.5 text-white">
                                <LogIn size={12} />
                                <span className="text-[10px] font-black uppercase tracking-wider">
                                    Access Portal
                                </span>
                                <ChevronRight
                                    size={12}
                                    className="-translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                />
                            </div>
                        </Link>

                        {/* Barangay Staff — light card */}
                        <Link
                            href={route("login.staff")}
                            className="group bg-white border border-gray-200 hover:border-gray-900 rounded-xl p-6 transition-all duration-200 flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className="w-9 h-9 bg-gray-100 group-hover:bg-gray-900 rounded-lg flex items-center justify-center transition-colors duration-200">
                                    <UserPlus
                                        size={16}
                                        className="text-gray-500 group-hover:text-white transition-colors duration-200"
                                    />
                                </div>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md">
                                    Barangay
                                </span>
                            </div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1.5">
                                Barangay Staff
                            </h3>
                            <p className="text-xs text-gray-400 leading-relaxed mb-5 flex-1">
                                Household profiling, beneficiary registration,
                                and assistance encoding for your assigned
                                barangay.
                            </p>
                            <div className="flex items-center gap-1.5 text-gray-900">
                                <LogIn size={12} />
                                <span className="text-[10px] font-black uppercase tracking-wider">
                                    Access Portal
                                </span>
                                <ChevronRight
                                    size={12}
                                    className="-translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                />
                            </div>
                        </Link>
                    </div>
                    
                    {/* Info strip */}
                    <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                System Operational
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                LGU Barbaza
                            </span>
                            <div className="h-3 w-px bg-gray-200" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                DSWD Region VI
                            </span>
                            <div className="h-3 w-px bg-gray-200" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                RA 10173
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} Municipal Government of
                        Barbaza, Antique
                    </p>
                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                        Powered by MSWDO · All Rights Reserved
                    </p>
                </div>
            </footer>
        </div>
    );
}
