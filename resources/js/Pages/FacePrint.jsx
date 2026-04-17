import { useEffect } from 'react';

const sampleRecord = {
    serial_number: 'FACED-2026-0001',
    region: 'Region VI',
    province: 'Antique',
    municipality: 'Barbaza',
    district: null,
    barangay: 'Poblacion',
    evacuation_center: null,
    last_name: 'Sumugat',
    first_name: 'John',
    middle_name: 'Carlo',
    name_extension: null,
    civil_status: 'Single',
    mothers_maiden_name: 'Rosalie S. Lomugdang',
    religion: 'Roman Catholic',
    occupation: 'Freelancer',
    birthdate: '2003-08-08',
    age: 22,
    sex: 'Male',
    birthplace: 'Malacanang',
    monthly_income: 3000,
    id_presented: 'National ID',
    id_number: null,
    contact_primary: '09567460163',
    contact_alternate: '09567460163',
    permanent_address: 'Culasi Antique, Philippines',
    is_4ps: false,
    is_ip: false,
    ip_group: null,
    bank_provider: 'Landbank',
    account_name: 'John Carlo Sumugat',
    account_type: 'Savings',
    account_number: '3376272620',
    house_ownership: 'Owner',
    shelter_damage: 'Partially Damaged',
    vai_score: 40,
    date_registered: '2026-03-12',
    family_members: [
        { name: 'John Carlo Sumugat', relationship: 'Sibling', birthdate: '2010-08-08', age: 15, sex: 'Male', birthplace: null, occupation: null, educational_attainment: null, vulnerabilities: [] },
    ],
    assistance_records: [
        { date: '2026-03-15', recipient_name: 'John Sumugat', emergency_type: 'Typhoon', assistance_provided: 'Family Food Pack', unit: 'Pack', quantity: 2, cost: 1500.00, provider: 'LGU Barbaza', status: 'Approved' },
        { date: '2026-03-20', recipient_name: 'John Sumugat', emergency_type: 'Typhoon', assistance_provided: 'Cash Assistance', unit: 'PHP', quantity: 1, cost: 3000.00, provider: 'DSWD', status: 'Approved' },
    ],
};

const dswd_blue = '#003087';
const header_bg = '#003087';
const row_alt = '#f0f4ff';

const styles = `
@page {
    size: legal landscape;
    margin: 6mm 8mm;
}
@media print {
    html, body { margin: 0; padding: 0; background: white; }
    .no-print { display: none !important; }
    .page-break { page-break-after: always; }
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, Helvetica, sans-serif; font-size: 6.5pt; color: #000; background: #e5e7eb; }
.print-wrapper { background: white; }
.page { width: 355mm; min-height: 210mm; background: white; display: flex; gap: 0; }
.copy { width: 50%; padding: 4mm 4mm 3mm 4mm; border: 0.3mm solid #000; position: relative; }
.copy + .copy { border-left: none; }

/* DSWD Header */
.form-header { display: flex; align-items: center; gap: 3mm; margin-bottom: 2mm; }
.dswd-logo { width: 10mm; height: 10mm; border: 0.5mm solid ${dswd_blue}; display: flex; align-items: center; justify-content: center; background: ${dswd_blue}; border-radius: 50%; flex-shrink: 0; }
.dswd-logo span { color: white; font-size: 5pt; font-weight: 900; text-align: center; line-height: 1.1; }
.header-text { flex: 1; }
.header-text .republic { font-size: 5pt; color: #333; }
.header-text .dept { font-size: 5pt; color: #333; }
.header-text .faced-title { font-size: 8pt; font-weight: 900; color: ${dswd_blue}; text-transform: uppercase; line-height: 1.2; }
.copy-label-box { border: 0.3mm solid #000; padding: 0.5mm 2mm; text-align: center; }
.copy-label-box .not-for-sale { font-size: 4.5pt; font-weight: 700; }
.copy-label-box .copy-type { font-size: 6pt; font-weight: 900; color: ${dswd_blue}; }

.serial-row { display: flex; justify-content: flex-end; align-items: center; gap: 2mm; margin-bottom: 1.5mm; font-size: 5.5pt; }
.serial-label { font-weight: 700; }
.serial-value { border-bottom: 0.3mm solid #000; min-width: 30mm; padding-bottom: 0.3mm; }

/* Section titles */
.section-title { background: ${header_bg}; color: white; text-align: center; font-size: 6pt; font-weight: 900; text-transform: uppercase; padding: 0.8mm 2mm; margin-bottom: 0; letter-spacing: 0.3mm; }

/* Grid layout for form fields */
.fields-grid { display: grid; border: 0.3mm solid #000; border-top: none; }
.field-row { display: flex; border-bottom: 0.3mm solid #000; min-height: 5mm; }
.field-row:last-child { border-bottom: none; }
.field-cell { flex: 1; border-right: 0.3mm solid #000; padding: 0.3mm 1mm; display: flex; flex-direction: column; justify-content: flex-end; }
.field-cell:last-child { border-right: none; }
.field-label { font-size: 4.5pt; color: #555; line-height: 1; margin-bottom: 0.5mm; }
.field-number { font-size: 4pt; color: #777; }
.field-value { font-size: 6pt; font-weight: 700; border-bottom: 0.15mm solid #aaa; min-height: 3.5mm; padding-bottom: 0.2mm; line-height: 1.3; }
.field-value.empty { color: transparent; }

/* Checkboxes inline */
.check-row { display: flex; align-items: center; gap: 1.5mm; font-size: 5.5pt; }
.checkbox { width: 2.5mm; height: 2.5mm; border: 0.3mm solid #000; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.checkbox.checked::after { content: '✓'; font-size: 4pt; font-weight: 900; }

/* Family members table */
.family-table { width: 100%; border-collapse: collapse; font-size: 5pt; }
.family-table th { background: ${header_bg}; color: white; text-align: center; padding: 0.5mm 0.5mm; font-size: 4.5pt; font-weight: 700; border: 0.2mm solid #002060; line-height: 1.2; }
.family-table td { border: 0.2mm solid #aaa; padding: 0.5mm 0.5mm; text-align: center; min-height: 4mm; font-size: 5pt; vertical-align: middle; }
.family-table tr:nth-child(even) td { background: ${row_alt}; }
.empty-row td { height: 4.5mm; }

/* Address + signature section */
.address-sig { display: flex; gap: 0; margin-top: 0; }
.address-box { flex: 1; border: 0.3mm solid #000; padding: 1mm; }
.sig-box { width: 42mm; border: 0.3mm solid #000; border-left: none; padding: 1mm; display: flex; flex-direction: column; justify-content: space-between; }
.sig-line { border-top: 0.3mm solid #000; width: 100%; margin-top: 3mm; }
.sig-label { font-size: 4.5pt; text-align: center; }

/* Account info */
.account-row { display: flex; border: 0.3mm solid #000; border-top: none; }
.account-cell { flex: 1; border-right: 0.3mm solid #000; padding: 0.5mm 1mm; }
.account-cell:last-child { border-right: none; }

/* Ownership / damage row */
.checkbox-section { border: 0.3mm solid #000; border-top: none; padding: 1mm; display: flex; gap: 8mm; align-items: center; }
.checkbox-group { display: flex; align-items: center; gap: 2mm; }
.checkbox-group-label { font-size: 5pt; font-weight: 700; margin-right: 1mm; }

/* Signature area */
.sig-area { border: 0.3mm solid #000; border-top: none; padding: 1.5mm; display: grid; grid-template-columns: 1fr 1fr; gap: 2mm; }
.sig-col { display: flex; flex-direction: column; gap: 1mm; }
.sig-entry { border-bottom: 0.3mm solid #000; min-height: 6mm; }

.privacy-box { border: 0.3mm solid #000; border-top: none; padding: 1mm 1.5mm; font-size: 4.5pt; color: #333; line-height: 1.4; }
.privacy-title { font-weight: 900; text-transform: uppercase; font-size: 4.5pt; }

/* Page 2 - Assistance table */
.page2 { width: 355mm; min-height: 210mm; background: white; display: flex; flex-direction: row; gap: 0; }
.assistance-copy { width: 50%; padding: 4mm 4mm 3mm 4mm; border: 0.3mm solid #000; }
.assistance-copy + .assistance-copy { border-left: none; }
.assist-table { width: 100%; border-collapse: collapse; font-size: 5pt; }
.assist-table th { background: ${header_bg}; color: white; text-align: center; padding: 0.7mm 0.5mm; font-size: 4.5pt; font-weight: 700; border: 0.2mm solid #002060; line-height: 1.3; }
.assist-table td { border: 0.2mm solid #aaa; padding: 0.5mm; text-align: center; min-height: 5mm; font-size: 5pt; vertical-align: middle; }
.assist-table tr:nth-child(even) td { background: ${row_alt}; }
.assist-empty td { height: 5.5mm; }

/* Screen preview */
@media screen {
    body { padding: 10mm; }
    .page, .page2 { margin: 0 auto 10mm; box-shadow: 0 2px 12px rgba(0,0,0,0.15); }
}
`;

function FieldCell({ number, label, value, flex = 1, children }) {
    return (
        <div className="field-cell" style={{ flex }}>
            <span className="field-label">
                {number && <span className="field-number">{number}. </span>}
                {label}
            </span>
            {children || <div className="field-value">{value || '\u00a0'}</div>}
        </div>
    );
}

function Checkbox({ checked, label }) {
    return (
        <span className="check-row" style={{ display: 'inline-flex', alignItems: 'center', gap: '1mm' }}>
            <span className="checkbox" style={{ checked: checked }}>{checked ? '✓' : ''}</span>
            <span>{label}</span>
        </span>
    );
}

function FacedCopy({ record, copyType }) {
    const emptyRows = Math.max(0, 5 - (record.family_members?.length || 0));

    return (
        <div className="copy">
            {/* Header */}
            <div className="form-header">
                <div className="dswd-logo">
                    <span>DSWD</span>
                </div>
                <div className="header-text">
                    <div className="republic">Republic of the Philippines</div>
                    <div className="dept">Department of Social Welfare and Development</div>
                    <div className="faced-title">Family Assistance Card in<br />Emergencies and Disasters (FACED)</div>
                </div>
                <div className="copy-label-box">
                    <div className="not-for-sale">THIS CARD IS NOT FOR SALE</div>
                    <div className="copy-type">{copyType}</div>
                    <div style={{ borderTop: '0.2mm solid #000', marginTop: '0.5mm', paddingTop: '0.3mm' }}>
                        <span style={{ fontSize: '4.5pt' }}>OFFICIAL USE ONLY</span>
                    </div>
                </div>
            </div>

            {/* Serial */}
            <div className="serial-row">
                <span className="serial-label">SERIAL NUMBER:</span>
                <span className="serial-value">{record.serial_number}</span>
            </div>

            {/* Location Section */}
            <div className="section-title">Location of the Affected Family</div>
            <div className="fields-grid">
                <div className="field-row">
                    <FieldCell number="1" label="Region" value={record.region} flex={1} />
                    <FieldCell number="4" label="District" value={record.district || ''} flex={1} />
                    <FieldCell number="5" label="Barangay" value={record.barangay} flex={1} />
                </div>
                <div className="field-row">
                    <FieldCell number="2" label="Province" value={record.province} flex={1} />
                    <FieldCell number="3" label="City / Municipality" value={record.municipality} flex={1} />
                    <FieldCell number="6" label="Evacuation Center / Site" value={record.evacuation_center || ''} flex={1} />
                </div>
            </div>

            {/* Head of Family */}
            <div className="section-title" style={{ marginTop: '1mm' }}>Head of the Family</div>
            <div className="fields-grid">
                <div className="field-row">
                    <FieldCell number="7" label="Last Name" value={record.last_name} flex={1.2} />
                    <FieldCell number="8" label="First Name" value={record.first_name} flex={1.2} />
                    <FieldCell number="9" label="Middle Name" value={record.middle_name} flex={1} />
                    <FieldCell number="10" label="Name Ext." value={record.name_extension || ''} flex={0.5} />
                </div>
                <div className="field-row">
                    <FieldCell number="15" label="Civil Status" value={record.civil_status} flex={1} />
                    <FieldCell number="16" label="Mother's Maiden Name" value={record.mothers_maiden_name} flex={1.5} />
                    <FieldCell number="17" label="Religion" value={record.religion} flex={1} />
                    <FieldCell number="18" label="Occupation" value={record.occupation} flex={1} />
                </div>
                <div className="field-row">
                    <FieldCell number="11" label="Birthdate (DD-Month-YYYY)" value={record.birthdate} flex={1} />
                    <FieldCell number="12" label="Age" value={record.age} flex={0.4} />
                    <FieldCell number="13" label="Birthplace" value={record.birthplace} flex={1} />
                    <FieldCell number="14" label="Sex" flex={0.8}>
                        <div className="field-value" style={{ display: 'flex', gap: '3mm' }}>
                            <span>☐ Male</span><span>☐ Female</span>
                        </div>
                    </FieldCell>
                </div>
                <div className="field-row">
                    <FieldCell number="19" label="Monthly Net Income" value={`₱${Number(record.monthly_income).toLocaleString()}`} flex={1} />
                    <FieldCell number="20" label="ID Card Presented" value={record.id_presented} flex={1.2} />
                    <FieldCell number="21" label="ID Number" value={record.id_number || ''} flex={1.2} />
                    <FieldCell number="22" label="Contact Number" flex={1.5}>
                        <div className="field-value" style={{ display: 'flex', gap: '2mm' }}>
                            <span>Primary: {record.contact_primary}</span>
                        </div>
                    </FieldCell>
                </div>
            </div>

            {/* Permanent Address */}
            <div className="field-row" style={{ border: '0.3mm solid #000', borderTop: 'none', minHeight: '5.5mm' }}>
                <div className="field-cell" style={{ flex: 1 }}>
                    <span className="field-label"><span className="field-number">23. </span>Permanent Address — House/Block/Lot No. · Street · Subd./Village · Barangay · City/Municipality · Province · Zip Code</span>
                    <div className="field-value">{record.permanent_address}</div>
                </div>
            </div>

            {/* Others Row */}
            <div className="field-row" style={{ border: '0.3mm solid #000', borderTop: 'none', minHeight: '5mm' }}>
                <div className="field-cell" style={{ flex: 1 }}>
                    <span className="field-label"><span className="field-number">24. </span>Others</span>
                    <div className="field-value" style={{ display: 'flex', gap: '4mm', alignItems: 'center' }}>
                        <span>☐ 4Ps Beneficiary</span>
                        <span>☐ IP (Type of Ethnicity: ___________)</span>
                    </div>
                </div>
            </div>

            {/* Family Members Table */}
            <div className="section-title" style={{ marginTop: '1mm' }}>
                <span style={{ fontSize: '5.5pt' }}>25. Family Information</span>
            </div>
            <table className="family-table">
                <thead>
                    <tr>
                        <th rowSpan={2} style={{ width: '28%' }}>Family Members</th>
                        <th rowSpan={2} style={{ width: '12%' }}>Relation<br />to Family<br />Head</th>
                        <th rowSpan={2} style={{ width: '13%' }}>Birthdate</th>
                        <th rowSpan={2} style={{ width: '6%' }}>Age</th>
                        <th rowSpan={2} style={{ width: '6%' }}>Sex</th>
                        <th rowSpan={2} style={{ width: '13%' }}>Birthplace</th>
                        <th colSpan={2}>Highest<br />Educ. Attainment</th>
                        <th rowSpan={2} style={{ width: '10%' }}>Occupation</th>
                        <th rowSpan={2} style={{ width: '12%' }}>Type of<br />Vulnerability</th>
                    </tr>
                    <tr>
                        <th style={{ width: '8%' }}>Level</th>
                        <th style={{ width: '8%' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {record.family_members?.map((m, i) => (
                        <tr key={i}>
                            <td style={{ textAlign: 'left', paddingLeft: '1mm' }}>{m.name}</td>
                            <td>{m.relationship}</td>
                            <td>{m.birthdate}</td>
                            <td>{m.age}</td>
                            <td>{m.sex}</td>
                            <td>{m.birthplace || ''}</td>
                            <td></td>
                            <td></td>
                            <td>{m.occupation || ''}</td>
                            <td>{m.vulnerabilities?.join(', ') || ''}</td>
                        </tr>
                    ))}
                    {Array.from({ length: emptyRows }).map((_, i) => (
                        <tr key={`e${i}`} className="empty-row">
                            <td></td><td></td><td></td><td></td><td></td>
                            <td></td><td></td><td></td><td></td><td></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Account Information */}
            <div className="section-title" style={{ marginTop: '1mm' }}>Account Information</div>
            <div className="account-row">
                <div className="account-cell">
                    <span className="field-label"><span className="field-number">26. </span>Bank/E-Wallet</span>
                    <div className="field-value">{record.bank_provider}</div>
                </div>
                <div className="account-cell">
                    <span className="field-label"><span className="field-number">27. </span>Account Name</span>
                    <div className="field-value">{record.account_name}</div>
                </div>
                <div className="account-cell">
                    <span className="field-label"><span className="field-number">28. </span>Account Type</span>
                    <div className="field-value">{record.account_type}</div>
                </div>
                <div className="account-cell">
                    <span className="field-label"><span className="field-number">29. </span>Account Number</span>
                    <div className="field-value">{record.account_number}</div>
                </div>
            </div>

            {/* Ownership / Shelter Damage */}
            <div className="checkbox-section">
                <div className="checkbox-group">
                    <span className="checkbox-group-label">30. House Ownership:</span>
                    <span>☐ Owner</span>
                    <span>☐ Renter</span>
                    <span>☐ Sharer</span>
                </div>
                <div className="checkbox-group">
                    <span className="checkbox-group-label">31. Shelter Damage Classification:</span>
                    <span>☐ Partially Damaged</span>
                    <span>☐ Totally Damaged</span>
                </div>
            </div>

            {/* Signature Area */}
            <div className="sig-area">
                <div className="sig-col">
                    <div style={{ display: 'flex', gap: '4mm' }}>
                        <div style={{ flex: 1 }}>
                            <div className="sig-entry"></div>
                            <div className="sig-label">Signature/Thumbmark of Family Head</div>
                        </div>
                        <div style={{ width: '18mm' }}>
                            <div className="sig-entry" style={{ border: '0.3mm solid #000', height: '8mm' }}></div>
                            <div className="sig-label">Right Thumbmark</div>
                        </div>
                    </div>
                    <div>
                        <div className="sig-entry"></div>
                        <div className="sig-label">Date Registered</div>
                    </div>
                </div>
                <div className="sig-col">
                    <div>
                        <div className="sig-entry"></div>
                        <div className="sig-label">Name/Signature of Barangay Captain</div>
                    </div>
                    <div>
                        <div className="sig-entry"></div>
                        <div className="sig-label">Name/Signature of LSWDO</div>
                    </div>
                </div>
            </div>

            {/* Privacy Notice */}
            <div className="privacy-box">
                <span className="privacy-title">32. Data Privacy Declaration — </span>
                All data and information indicated herein shall be used for identification purposes for the implementation of disaster risk reduction and management (DRRM) programs, projects, and activities and its disclosure shall be in compliance to Republic Act 10173 (Data Privacy Act of 2012).
            </div>
        </div>
    );
}

function AssistanceCopy({ record, copyType }) {
    const emptyRows = Math.max(0, 14 - (record.assistance_records?.length || 0));

    return (
        <div className="assistance-copy">
            {/* Header */}
            <div className="form-header">
                <div className="dswd-logo">
                    <span>DSWD</span>
                </div>
                <div className="header-text">
                    <div className="republic">Republic of the Philippines</div>
                    <div className="dept">Department of Social Welfare and Development</div>
                    <div className="faced-title">Family Assistance Card in<br />Emergencies and Disasters (FACED)</div>
                </div>
                <div className="copy-label-box">
                    <div className="not-for-sale">THIS CARD IS NOT FOR SALE</div>
                    <div className="copy-type">{copyType}</div>
                    <div style={{ borderTop: '0.2mm solid #000', marginTop: '0.5mm', paddingTop: '0.3mm' }}>
                        <span style={{ fontSize: '4.5pt' }}>OFFICIAL USE ONLY</span>
                    </div>
                </div>
            </div>
            <div className="serial-row">
                <span className="serial-label">SERIAL NUMBER:</span>
                <span className="serial-value">{record.serial_number}</span>
            </div>

            {/* Name banner */}
            <div style={{ border: '0.3mm solid #000', padding: '1mm 2mm', marginBottom: '1mm', display: 'flex', gap: '4mm', alignItems: 'center', background: '#f8f9ff' }}>
                <span style={{ fontSize: '6pt' }}><strong>Family Head:</strong> {record.last_name}, {record.first_name} {record.middle_name || ''}</span>
                <span style={{ fontSize: '6pt' }}><strong>Barangay:</strong> {record.barangay}</span>
                <span style={{ fontSize: '6pt' }}><strong>Municipality:</strong> {record.municipality}</span>
                <span style={{ fontSize: '6pt' }}><strong>Province:</strong> {record.province}</span>
            </div>

            {/* Assistance Table */}
            <div className="section-title">35. Family Assistance Record</div>
            <table className="assist-table">
                <thead>
                    <tr>
                        <th style={{ width: '9%' }}>Date</th>
                        <th style={{ width: '18%' }}>Name of Receiving<br />Family Member</th>
                        <th style={{ width: '12%' }}>Emergency /<br />Disaster</th>
                        <th style={{ width: '16%' }}>Assistance<br />Provided</th>
                        <th style={{ width: '7%' }}>Unit</th>
                        <th style={{ width: '7%' }}>Qty</th>
                        <th style={{ width: '10%' }}>Cost</th>
                        <th style={{ width: '12%' }}>Provider</th>
                        <th style={{ width: '9%' }}>Signature /<br />Thumbmark</th>
                    </tr>
                </thead>
                <tbody>
                    {record.assistance_records?.map((a, i) => (
                        <tr key={i}>
                            <td>{a.date}</td>
                            <td style={{ textAlign: 'left', paddingLeft: '1mm' }}>{a.recipient_name}</td>
                            <td>{a.emergency_type}</td>
                            <td style={{ textAlign: 'left', paddingLeft: '1mm' }}>{a.assistance_provided}</td>
                            <td>{a.unit}</td>
                            <td>{a.quantity}</td>
                            <td>₱{Number(a.cost).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                            <td>{a.provider}</td>
                            <td></td>
                        </tr>
                    ))}
                    {Array.from({ length: emptyRows }).map((_, i) => (
                        <tr key={`e${i}`} className="assist-empty">
                            <td></td><td></td><td></td><td></td><td></td>
                            <td></td><td></td><td></td><td></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Total row */}
            <div style={{ border: '0.3mm solid #000', borderTop: 'none', display: 'flex', justifyContent: 'flex-end', padding: '0.8mm 2mm', gap: '4mm' }}>
                <span style={{ fontSize: '6pt', fontWeight: '700' }}>Total Cost:</span>
                <span style={{ fontSize: '6pt', fontWeight: '700', minWidth: '20mm', textAlign: 'right' }}>
                    ₱{(record.assistance_records?.reduce((s, a) => s + Number(a.cost), 0) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            </div>

            {/* Validation signatures */}
            <div style={{ border: '0.3mm solid #000', borderTop: 'none', padding: '1.5mm', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2mm', marginTop: '1mm' }}>
                {['Prepared by', 'Reviewed by', 'Approved by'].map(label => (
                    <div key={label}>
                        <div style={{ borderBottom: '0.3mm solid #000', height: '7mm' }}></div>
                        <div style={{ fontSize: '4.5pt', textAlign: 'center', marginTop: '0.5mm' }}>{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function FacedPrint({ record = sampleRecord }) {
    return (
        <>
            <style>{styles}</style>

            {/* Print button - screen only */}
            <div className="no-print" style={{ textAlign: 'center', padding: '8px 0 12px', background: '#e5e7eb' }}>
                <button
                    onClick={() => window.print()}
                    style={{ background: dswd_blue, color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', letterSpacing: '0.05em' }}
                >
                    🖨 Print / Save as PDF
                </button>
                <span style={{ marginLeft: '12px', fontSize: '11px', color: '#666' }}>Set paper size to Legal (8.5 × 14 in), Landscape orientation</span>
            </div>

            <div className="print-wrapper">
                {/* Page 1 — Registration Form (two-up) */}
                <div className="page">
                    <FacedCopy record={record} copyType="BENEFICIARY'S COPY" />
                    <FacedCopy record={record} copyType="SOCIAL WORKER'S COPY" />
                </div>

                {/* Page Break */}
                <div className="page-break" />

                {/* Page 2 — Assistance Record (two-up) */}
                <div className="page2">
                    <AssistanceCopy record={record} copyType="BENEFICIARY'S COPY" />
                    <AssistanceCopy record={record} copyType="SOCIAL WORKER'S COPY" />
                </div>
            </div>
        </>
    );
}