import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, FileText, BarChart2,
    ShieldAlert, Users, LogOut, ShieldCheck, Menu, X, ChevronRight,
    HandHelping
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutDashboard,
            active: route().current('dashboard'),
            roles: ['Barangay Staff', 'MSWDO / Admin'],
        },
        {
            label: 'FACED Records',
            href: route('records.index'),
            icon: FileText,
            active: route().current('records.*'),
            roles: ['Barangay Staff', 'MSWDO / Admin'],
        },
        {
            label: 'Assistance Records',
            href: route('assistance.index'),
            icon: HandHelping,
            active: route().current('assistance.index'),
            roles: ['MSWDO / Admin'],
        },
        {
            label: 'Reports',
            href: route('reports.index'),
            icon: BarChart2,
            active: route().current('reports.*'),
            roles: ['Barangay Staff', 'MSWDO / Admin'],
        },
        {
            label: 'User Management',
            href: route('users.index'),
            icon: Users,
            active: route().current('users.*'),
            roles: ['MSWDO / Admin'],
        },
    ];

    const visibleNav = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">

            {/* Sidebar — sticky full height, never scrolls */}
            <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shrink-0`}>

                {/* Logo */}
                <div className={`h-[57px] border-b border-gray-200 flex items-center shrink-0 ${sidebarOpen ? 'px-4 justify-between' : 'justify-center'}`}>
                    {sidebarOpen && (
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                                <ShieldCheck size={14} className="text-white" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none truncate">Barbaza FACED</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">MSWDO Portal</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-400 hover:text-gray-900 transition-colors p-1 shrink-0"
                    >
                        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    {visibleNav.map(item => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                                ${item.active
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                } ${!sidebarOpen ? 'justify-center' : ''}`}
                        >
                            <item.icon size={16} className="shrink-0" />
                            {sidebarOpen && (
                                <span className="text-[11px] font-black uppercase tracking-wide flex-1 truncate">
                                    {item.label}
                                </span>
                            )}
                            {sidebarOpen && item.active && (
                                <ChevronRight size={12} className="shrink-0 opacity-60" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User Info */}
                <div className="p-3 border-t border-gray-200 space-y-1 shrink-0">
                    <div className={`flex items-center gap-2.5 px-3 py-2 ${!sidebarOpen ? 'justify-center' : ''}`}>
                        <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-white text-[10px] font-black">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {sidebarOpen && (
                            <div className="overflow-hidden flex-1">
                                <p className="text-xs font-black text-gray-900 truncate leading-none">{user.name}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider truncate leading-none mt-0.5">
                                    {user.role}
                                </p>
                            </div>
                        )}
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className={`w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ${!sidebarOpen ? 'justify-center' : ''}`}
                    >
                        <LogOut size={14} />
                        {sidebarOpen && (
                            <span className="text-[11px] font-black uppercase tracking-wide">Logout</span>
                        )}
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col overflow-y-auto">

                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-8 h-[57px] flex items-center justify-between sticky top-0 z-30 shrink-0">
                    <div>
                        <h1 className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none">
                            Municipality of Barbaza, Antique
                        </h1>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">
                            Family Assistance Card in Emergencies and Disasters
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {user.assigned_barangay && (
                            <span className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                Brgy. {user.assigned_barangay}
                            </span>
                        )}
                        <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {user.role}
                        </span>
                    </div>
                </header>

                <FlashMessages />

                <div className="p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}

function FlashMessages() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);

    if (!visible) return null;
    if (!flash?.success && !flash?.error) return null;

    return (
        <div className={`mx-8 mt-6 px-5 py-3.5 rounded-xl flex items-center justify-between text-sm font-bold border
            ${flash.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
        >
            <span className="text-xs uppercase tracking-wide font-black">{flash.success || flash.error}</span>
            <button onClick={() => setVisible(false)} className="ml-4 opacity-40 hover:opacity-100 transition-opacity">
                <X size={14} />
            </button>
        </div>
    );
}