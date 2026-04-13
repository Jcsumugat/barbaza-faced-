import Layout from '@/Components/Layout';
import { useForm, usePage } from '@inertiajs/react';
import {
    MapPin, User, Users, CreditCard, Home,
    ShieldCheck, Plus, Trash2, ChevronDown, ChevronUp, Save
} from 'lucide-react';
import { useState } from 'react';

const BARANGAYS      = ['Binangbang','Cadiao','Capuyas','Esparar','Guintas','Ipil','Jinalinan','Luntao','Magtulis','Mayabay','Nalupa','Poblacion'];
const VULNERABILITIES = ['PWD','Senior Citizen','Pregnant/Lactating','Solo Parent','Others'];
const RELATIONSHIPS   = ['Child','Spouse','Parent','Sibling','Grandparent','In-law','Others'];

const inputClass = 'w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-900 text-gray-900 placeholder-gray-300 rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed';
const labelClass = 'block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5';

function SectionHeader({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-3 pb-3 mb-5 border-b border-gray-200">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                <Icon size={14} className="text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-tight text-gray-900">{title}</span>
        </div>
    );
}

function calculateAge(birthdate) {
    if (!birthdate) return '';
    const today = new Date();
    const dob   = new Date(birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
}

export default function FacedForm({ record }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin     = user.role === 'MSWDO / Admin';
    const isEdit      = !!record?.id;
    const isValidated = record?.status === 'Validated';

    const { data, setData, post, put, processing, errors } = useForm({
        region:              record?.region              || 'Region VI',
        province:            record?.province            || 'Antique',
        municipality:        record?.municipality        || 'Barbaza',
        district:            record?.district            || '',
        barangay:            record?.barangay            || user.assigned_barangay || '',
        evacuation_center:   record?.evacuation_center   || '',
        date_registered:     record?.date_registered     || new Date().toISOString().split('T')[0],
        last_name:           record?.last_name           || '',
        first_name:          record?.first_name          || '',
        middle_name:         record?.middle_name         || '',
        name_extension:      record?.name_extension      || '',
        civil_status:        record?.civil_status        || 'Single',
        mothers_maiden_name: record?.mothers_maiden_name || '',
        religion:            record?.religion            || '',
        occupation:          record?.occupation          || '',
        birthdate:           record?.birthdate           || '',
        age:                 record?.age                 || '',
        sex:                 record?.sex                 || 'Male',
        birthplace:          record?.birthplace          || '',
        monthly_income:      record?.monthly_income      || '0',
        id_presented:        record?.id_presented        || 'National ID',
        id_number:           record?.id_number           || '',
        contact_primary:     record?.contact_primary     || '',
        contact_alternate:   record?.contact_alternate   || '',
        permanent_address:   record?.permanent_address   || '',
        is_4ps:              record?.is_4ps              || false,
        is_ip:               record?.is_ip               || false,
        ip_group:            record?.ip_group            || '',
        others_category:     record?.others_category     || '',
        bank_provider:       record?.bank_provider       || '',
        account_name:        record?.account_name        || '',
        account_type:        record?.account_type        || 'Savings',
        account_number:      record?.account_number      || '',
        house_ownership:     record?.house_ownership     || 'Owner',
        shelter_damage:      record?.shelter_damage      || 'None',
        consent_checked:     record?.consent_checked     || false,
        remarks:             record?.remarks             || '',
        family_members: record?.family_members?.map(m => ({
            ...m, vulnerabilities: m.vulnerabilities || [],
        })) || [],
    });

    const [expandedMembers, setExpandedMembers] = useState([]);

    const toggleMember  = (i) => setExpandedMembers(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

    const addMember = () => {
        const idx = data.family_members.length;
        setData('family_members', [...data.family_members, {
            id: null, name: '', relationship: 'Child',
            birthdate: '', age: '', sex: 'Male',
            birthplace: '', occupation: '',
            educational_attainment: '', vulnerabilities: [],
        }]);
        setExpandedMembers(prev => [...prev, idx]);
    };

    const updateMember = (i, field, value) => {
        const updated = [...data.family_members];
        updated[i] = { ...updated[i], [field]: value };
        if (field === 'birthdate') updated[i].age = calculateAge(value);
        setData('family_members', updated);
    };

    const toggleVulnerability = (i, vuln) => {
        const updated = [...data.family_members];
        const vulns = updated[i].vulnerabilities || [];
        updated[i].vulnerabilities = vulns.includes(vuln) ? vulns.filter(v => v !== vuln) : [...vulns, vuln];
        setData('family_members', updated);
    };

    const removeMember = (i) => {
        setData('family_members', data.family_members.filter((_, idx) => idx !== i));
        setExpandedMembers(prev => prev.filter(x => x !== i).map(x => x > i ? x - 1 : x));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        isEdit ? put(route('records.update', record.id)) : post(route('records.store'));
    };

    const vaiPreview = (() => {
        let score = 0;
        if (data.is_4ps) score += 10;
        if (data.is_ip)  score += 10;
        if (data.others_category) score += 5;
        const income = parseFloat(data.monthly_income) || 0;
        if (income < 5000) score += 25;
        else if (income < 10000) score += 15;
        else if (income < 15000) score += 5;
        const vulnCount = data.family_members.reduce((acc, m) => acc + (m.vulnerabilities?.length || 0), 0);
        score += Math.min(vulnCount * 5, 30);
        if (data.shelter_damage === 'Totally Damaged')    score += 30;
        else if (data.shelter_damage === 'Partially Damaged') score += 15;
        return score;
    })();

    const readOnly = isValidated && !isAdmin;

    return (
        <Layout>
            <div className="space-y-5">

                {/* Page Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                            {isEdit ? 'Edit FACED Record' : 'New FACED Record'}
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {isEdit
                                ? <>Serial: <span className="font-mono text-gray-700">{record?.serial_number}</span> · Status: <span className={
                                    record?.status === 'Validated' ? 'text-emerald-600' :
                                    record?.status === 'Returned'  ? 'text-amber-600'   : 'text-gray-600'
                                }>{record?.status}</span></>
                                : 'Family Assistance Card in Emergencies and Disasters — Form 1-A'
                            }
                        </p>
                    </div>

                    {/* VAI Score Preview */}
                    <div className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 flex items-center gap-4 shrink-0">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">VAI Score</p>
                            <p className="text-2xl font-black text-gray-900 leading-none mt-0.5">{vaiPreview}</p>
                        </div>
                        <div className="w-14">
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-gray-900 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(vaiPreview, 100)}%` }} />
                            </div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 text-right">/ 110</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* ── Section 1: Location ── */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <SectionHeader icon={MapPin} title="Location Information" />
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>Region</label>
                                <input value={data.region} onChange={e => setData('region', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Province</label>
                                <input value={data.province} onChange={e => setData('province', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Municipality</label>
                                <input value={data.municipality} onChange={e => setData('municipality', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>District</label>
                                <input value={data.district} onChange={e => setData('district', e.target.value)} className={inputClass} placeholder="Optional" disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Barangay</label>
                                {isAdmin && !readOnly ? (
                                    <select value={data.barangay} onChange={e => setData('barangay', e.target.value)} className={inputClass}>
                                        <option value="">Select Barangay</option>
                                        {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                ) : (
                                    <input value={data.barangay} className={inputClass} disabled />
                                )}
                                {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Evacuation Center</label>
                                <input value={data.evacuation_center} onChange={e => setData('evacuation_center', e.target.value)} className={inputClass} placeholder="Optional" disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Date Registered</label>
                                <input type="date" value={data.date_registered} onChange={e => setData('date_registered', e.target.value)} className={inputClass} disabled={readOnly} />
                                {errors.date_registered && <p className="text-red-500 text-xs mt-1">{errors.date_registered}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ── Section 2: Head of Family ── */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <SectionHeader icon={User} title="Head of Family" />
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>Last Name</label>
                                <input value={data.last_name} onChange={e => setData('last_name', e.target.value)} className={inputClass} disabled={readOnly} />
                                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>First Name</label>
                                <input value={data.first_name} onChange={e => setData('first_name', e.target.value)} className={inputClass} disabled={readOnly} />
                                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Middle Name</label>
                                <input value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Extension (Jr./Sr./III)</label>
                                <input value={data.name_extension} onChange={e => setData('name_extension', e.target.value)} className={inputClass} placeholder="Jr., Sr., III" disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Sex</label>
                                <select value={data.sex} onChange={e => setData('sex', e.target.value)} className={inputClass} disabled={readOnly}>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Civil Status</label>
                                <select value={data.civil_status} onChange={e => setData('civil_status', e.target.value)} className={inputClass} disabled={readOnly}>
                                    {['Single','Married','Widowed','Separated','Co-habiting'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Birthdate</label>
                                <input type="date" value={data.birthdate}
                                    onChange={e => { setData('birthdate', e.target.value); setData('age', calculateAge(e.target.value)); }}
                                    className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Age</label>
                                <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Birthplace</label>
                                <input value={data.birthplace} onChange={e => setData('birthplace', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Religion</label>
                                <input value={data.religion} onChange={e => setData('religion', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Occupation</label>
                                <input value={data.occupation} onChange={e => setData('occupation', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Monthly Income (₱)</label>
                                <input type="number" min="0" value={data.monthly_income} onChange={e => setData('monthly_income', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Mother's Maiden Name</label>
                                <input value={data.mothers_maiden_name} onChange={e => setData('mothers_maiden_name', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div className="lg:col-span-4">
                                <label className={labelClass}>Permanent Address</label>
                                <input value={data.permanent_address} onChange={e => setData('permanent_address', e.target.value)} className={inputClass} disabled={readOnly} />
                                {errors.permanent_address && <p className="text-red-500 text-xs mt-1">{errors.permanent_address}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Contact (Primary)</label>
                                <input value={data.contact_primary} onChange={e => setData('contact_primary', e.target.value)} className={inputClass} disabled={readOnly} />
                                {errors.contact_primary && <p className="text-red-500 text-xs mt-1">{errors.contact_primary}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Contact (Alternate)</label>
                                <input value={data.contact_alternate} onChange={e => setData('contact_alternate', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>ID Presented</label>
                                <input value={data.id_presented} onChange={e => setData('id_presented', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>ID Number</label>
                                <input value={data.id_number} onChange={e => setData('id_number', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                        </div>

                        {/* Social Category */}
                        <div className="mt-5 pt-5 border-t border-gray-100">
                            <p className={labelClass}>Social Category</p>
                            <div className="flex flex-wrap gap-6 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.is_4ps} onChange={e => setData('is_4ps', e.target.checked)} disabled={readOnly} className="w-4 h-4 rounded border-gray-300 accent-gray-900" />
                                    <span className="text-sm font-bold text-gray-700">4Ps Beneficiary</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.is_ip} onChange={e => setData('is_ip', e.target.checked)} disabled={readOnly} className="w-4 h-4 rounded border-gray-300 accent-gray-900" />
                                    <span className="text-sm font-bold text-gray-700">Indigenous People (IP)</span>
                                </label>
                                {data.is_ip && (
                                    <input value={data.ip_group} onChange={e => setData('ip_group', e.target.value)}
                                        placeholder="IP Group/Tribe" className={`${inputClass} w-48`} disabled={readOnly} />
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-700">Others:</span>
                                    <input value={data.others_category} onChange={e => setData('others_category', e.target.value)}
                                        placeholder="Specify..." className={`${inputClass} w-48`} disabled={readOnly} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Section 3: Family Members ── */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-200 flex-1 mr-4">
                                <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                                    <Users size={14} className="text-white" />
                                </div>
                                <span className="text-sm font-black uppercase tracking-tight text-gray-900">Family Members</span>
                                <span className="bg-gray-100 text-gray-600 text-[9px] font-black px-2 py-0.5 rounded-md">
                                    {data.family_members.length}
                                </span>
                            </div>
                            {!readOnly && (
                                <button type="button" onClick={addMember}
                                    className="bg-gray-900 hover:bg-gray-800 text-white px-3.5 py-2 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shrink-0">
                                    <Plus size={13} /><span>Add Member</span>
                                </button>
                            )}
                        </div>

                        {data.family_members.length === 0 ? (
                            <p className="text-center py-10 text-gray-300 font-black uppercase tracking-widest text-xs">
                                No family members added yet
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {data.family_members.map((member, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Member Header */}
                                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
                                            onClick={() => toggleMember(i)}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center shrink-0">
                                                    <span className="text-white text-[9px] font-black">{i + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-sm">
                                                        {member.name || <span className="text-gray-400 font-bold italic">Unnamed Member</span>}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {member.relationship}{member.age ? ` · Age ${member.age}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {member.vulnerabilities?.length > 0 && (
                                                    <span className="bg-gray-200 text-gray-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                                                        {member.vulnerabilities.length} vuln.
                                                    </span>
                                                )}
                                                {!readOnly && (
                                                    <button type="button"
                                                        onClick={e => { e.stopPropagation(); removeMember(i); }}
                                                        className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                                {expandedMembers.includes(i)
                                                    ? <ChevronUp size={14} className="text-gray-400" />
                                                    : <ChevronDown size={14} className="text-gray-400" />
                                                }
                                            </div>
                                        </div>

                                        {/* Member Fields */}
                                        {expandedMembers.includes(i) && (
                                            <div className="p-4 space-y-4 border-t border-gray-100">
                                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className={labelClass}>Full Name</label>
                                                        <input value={member.name} onChange={e => updateMember(i, 'name', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Relationship</label>
                                                        <select value={member.relationship} onChange={e => updateMember(i, 'relationship', e.target.value)} className={inputClass} disabled={readOnly}>
                                                            {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Sex</label>
                                                        <select value={member.sex} onChange={e => updateMember(i, 'sex', e.target.value)} className={inputClass} disabled={readOnly}>
                                                            <option>Male</option><option>Female</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Birthdate</label>
                                                        <input type="date" value={member.birthdate} onChange={e => updateMember(i, 'birthdate', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Age</label>
                                                        <input type="number" value={member.age} onChange={e => updateMember(i, 'age', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Birthplace</label>
                                                        <input value={member.birthplace} onChange={e => updateMember(i, 'birthplace', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Occupation</label>
                                                        <input value={member.occupation} onChange={e => updateMember(i, 'occupation', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Educational Attainment</label>
                                                        <input value={member.educational_attainment} onChange={e => updateMember(i, 'educational_attainment', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                </div>
                                                <div className="pt-3 border-t border-gray-100">
                                                    <p className={labelClass}>Vulnerabilities</p>
                                                    <div className="flex flex-wrap gap-4 mt-2">
                                                        {VULNERABILITIES.map(vuln => (
                                                            <label key={vuln} className="flex items-center gap-2 cursor-pointer">
                                                                <input type="checkbox"
                                                                    checked={member.vulnerabilities?.includes(vuln) || false}
                                                                    onChange={() => !readOnly && toggleVulnerability(i, vuln)}
                                                                    disabled={readOnly}
                                                                    className="w-4 h-4 rounded border-gray-300 accent-gray-900" />
                                                                <span className="text-xs font-bold text-gray-700">{vuln}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Section 4: Account Info ── */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <SectionHeader icon={CreditCard} title="Financial Account Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>Bank / E-Wallet Provider</label>
                                <input value={data.bank_provider} onChange={e => setData('bank_provider', e.target.value)} className={inputClass} placeholder="e.g. Landbank, GCash" disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Account Name</label>
                                <input value={data.account_name} onChange={e => setData('account_name', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Account Type</label>
                                <select value={data.account_type} onChange={e => setData('account_type', e.target.value)} className={inputClass} disabled={readOnly}>
                                    <option>Savings</option><option>Checking</option><option>E-Wallet</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Account Number</label>
                                <input value={data.account_number} onChange={e => setData('account_number', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                        </div>
                    </div>

                    {/* ── Section 5: Housing & Damage ── */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <SectionHeader icon={Home} title="Housing & Shelter Damage" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>House Ownership</label>
                                <select value={data.house_ownership} onChange={e => setData('house_ownership', e.target.value)} className={inputClass} disabled={readOnly}>
                                    <option>Owner</option><option>Renter</option><option>Sharer</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Shelter Damage</label>
                                <select value={data.shelter_damage} onChange={e => setData('shelter_damage', e.target.value)} className={inputClass} disabled={readOnly}>
                                    <option>None</option>
                                    <option>Partially Damaged</option>
                                    <option>Totally Damaged</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Section 6: Consent & Remarks ── */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <SectionHeader icon={ShieldCheck} title="Consent & Remarks" />
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" checked={data.consent_checked}
                                    onChange={e => setData('consent_checked', e.target.checked)}
                                    disabled={readOnly}
                                    className="w-4 h-4 rounded border-gray-300 accent-gray-900 mt-0.5 shrink-0" />
                                <span className="text-sm font-bold text-gray-700 leading-relaxed">
                                    I hereby certify that the information provided is true and correct. I consent to the collection and processing of my personal data in accordance with the Data Privacy Act of 2012 (RA 10173).
                                </span>
                            </label>
                            {errors.consent_checked && <p className="text-red-500 text-xs">{errors.consent_checked}</p>}
                            <div>
                                <label className={labelClass}>Remarks / Notes</label>
                                <textarea value={data.remarks} onChange={e => setData('remarks', e.target.value)}
                                    rows={3} disabled={readOnly}
                                    className={`${inputClass} resize-none`}
                                    placeholder="Optional remarks from the staff..." />
                            </div>
                        </div>
                    </div>

                    {/* ── Submit Buttons ── */}
                    {!readOnly && (
                        <div className="flex items-center justify-end gap-3 pb-4">
                            <a href={route('records.index')}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-black text-xs uppercase tracking-widest transition-all">
                                Cancel
                            </a>
                            <button type="submit" disabled={processing}
                                className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white px-7 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95">
                                {processing ? (
                                    <span className="animate-pulse">Saving...</span>
                                ) : (
                                    <><Save size={14} /><span>{isEdit ? 'Update Record' : 'Submit Record'}</span></>
                                )}
                            </button>
                        </div>
                    )}

                </form>
            </div>
        </Layout>
    );
}