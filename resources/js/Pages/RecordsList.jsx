import Layout from "@/Components/Layout";
import { Link, router, usePage } from "@inertiajs/react";
import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    FileCheck,
    RotateCcw,
    ShieldAlert,
} from "lucide-react";
import { useState } from "react";

const STATUS_COLORS = {
    Submitted: "bg-gray-100 text-gray-700 border border-gray-200",
    Returned: "bg-amber-50 text-amber-700 border border-amber-200",
    Validated: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const DAMAGE_COLORS = {
    None: "bg-gray-100 text-gray-500",
    "Partially Damaged": "bg-amber-50 text-amber-700 border border-amber-200",
    "Totally Damaged": "bg-red-50 text-red-700 border border-red-200",
};

export default function RecordsList({ records, filters }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user.role === "MSWDO / Admin";

    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [barangay, setBarangay] = useState(filters?.barangay || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("records.index"),
            { search, status, barangay },
            { preserveState: true },
        );
    };

    const handleValidate = (id) => {
        if (!confirm("Mark this record as Validated?")) return;
        router.patch(route("records.validate", id));
    };

    const handleReturn = (id) => {
        if (!confirm("Return this record for revision?")) return;
        router.patch(route("records.return", id));
    };

    const selectClass =
        "w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-900 rounded-lg pl-9 pr-4 py-2.5 text-sm font-medium text-gray-900 outline-none transition-all appearance-none";

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                            FACED Records
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            Household Profiling — Family Assistance Card
                        </p>
                    </div>
                    <Link
                        href={route("records.create")}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shrink-0"
                    >
                        <Plus size={14} />
                        <span>New Record</span>
                    </Link>
                </div>

                {/* Filters */}
                <form
                    onSubmit={handleSearch}
                    className="bg-white border border-gray-200 rounded-xl p-5"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={14}
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or serial number..."
                                className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-900 rounded-lg pl-9 pr-4 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-300 outline-none transition-all"
                            />
                        </div>

                        {/* Status */}
                        <div className="relative">
                            <Filter
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={13}
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className={selectClass}
                            >
                                <option value="">All Statuses</option>
                                <option value="Submitted">Submitted</option>
                                <option value="Returned">Returned</option>
                                <option value="Validated">Validated</option>
                            </select>
                        </div>

                        {/* Barangay — admin only */}
                        {isAdmin ? (
                            <div className="relative">
                                <Filter
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={13}
                                />
                                <select
                                    value={barangay}
                                    onChange={(e) =>
                                        setBarangay(e.target.value)
                                    }
                                    className={selectClass}
                                >
                                    <option value="">All Barangays</option>
                                    {[
                                        "Binangbang",
                                        "Cadiao",
                                        "Capuyas",
                                        "Esparar",
                                        "Guintas",
                                        "Ipil",
                                        "Jinalinan",
                                        "Luntao",
                                        "Magtulis",
                                        "Mayabay",
                                        "Nalupa",
                                        "Poblacion",
                                    ].map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div />
                        )}

                        <button
                            type="submit"
                            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="px-6 py-3.5 text-left">
                                        Serial No.
                                    </th>
                                    <th className="px-6 py-3.5 text-left">
                                        Household Head
                                    </th>
                                    <th className="px-6 py-3.5 text-left">
                                        Barangay
                                    </th>
                                    <th className="px-6 py-3.5 text-left">
                                        Status
                                    </th>
                                    <th className="px-6 py-3.5 text-left">
                                        Shelter Damage
                                    </th>
                                    <th className="px-6 py-3.5 text-center">
                                        VAI
                                    </th>
                                    <th className="px-6 py-3.5 text-left">
                                        Date Filed
                                    </th>
                                    <th className="px-6 py-3.5 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {records.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-16 text-center text-gray-300 font-black uppercase tracking-widest text-xs"
                                        >
                                            No records found
                                        </td>
                                    </tr>
                                ) : (
                                    records.data.map((record) => (
                                        <tr
                                            key={record.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-3.5">
                                                <span className="font-mono text-[10px] font-black text-gray-400 tracking-widest">
                                                    {record.serial_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className="font-black text-gray-900 text-sm block truncate max-w-[180px]">
                                                    {record.last_name},{" "}
                                                    {record.first_name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-sm font-bold text-gray-500 whitespace-nowrap">
                                                {record.barangay}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${STATUS_COLORS[record.status]}`}
                                                >
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${DAMAGE_COLORS[record.shelter_damage]}`}
                                                >
                                                    {record.shelter_damage}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-black text-gray-900 text-sm">
                                                        {record.vai_score}
                                                    </span>
                                                    <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-gray-900 h-full rounded-full"
                                                            style={{
                                                                width: `${Math.min(record.vai_score, 100)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-sm font-bold text-gray-400 whitespace-nowrap">
                                                {record.date_registered}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link
                                                        href={route(
                                                            "records.show",
                                                            record.id,
                                                        )}
                                                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                                        title="View"
                                                    >
                                                        <Eye size={14} />
                                                    </Link>
                                                    {/* ── NEW: Assistance button ── */}
                                                    <Link
                                                        href={route(
                                                            "assistance.show",
                                                            record.id,
                                                        )}
                                                        className="p-1.5 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Assistance Records"
                                                    >
                                                        <ShieldAlert
                                                            size={14}
                                                        />
                                                    </Link>
                                                    {record.status !==
                                                        "Validated" && (
                                                        <Link
                                                            href={route(
                                                                "records.edit",
                                                                record.id,
                                                            )}
                                                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                                            title="Edit"
                                                        >
                                                            <Edit size={14} />
                                                        </Link>
                                                    )}
                                                    {isAdmin &&
                                                        record.status ===
                                                            "Submitted" && (
                                                            <button
                                                                onClick={() =>
                                                                    handleValidate(
                                                                        record.id,
                                                                    )
                                                                }
                                                                className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                                                                title="Validate"
                                                            >
                                                                <FileCheck
                                                                    size={14}
                                                                />
                                                            </button>
                                                        )}
                                                    {isAdmin &&
                                                        record.status ===
                                                            "Submitted" && (
                                                            <button
                                                                onClick={() =>
                                                                    handleReturn(
                                                                        record.id,
                                                                    )
                                                                }
                                                                className="p-1.5 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
                                                                title="Return for revision"
                                                            >
                                                                <RotateCcw
                                                                    size={14}
                                                                />
                                                            </button>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {records.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Showing {records.from}–{records.to} of{" "}
                                {records.total} records
                            </p>
                            <div className="flex items-center gap-1">
                                {records.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url && router.get(link.url)
                                        }
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all
                                            ${
                                                link.active
                                                    ? "bg-gray-900 text-white"
                                                    : link.url
                                                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                      : "bg-gray-50 text-gray-300 cursor-not-allowed"
                                            }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
