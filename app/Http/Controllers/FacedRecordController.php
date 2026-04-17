<?php

namespace App\Http\Controllers;

use App\Models\FacedRecord;
use App\Models\FamilyMember;
use App\Models\FamilyMemberVulnerability;
use App\Services\VaiScoreService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FacedRecordController extends Controller
{
    public function __construct(protected VaiScoreService $vaiService) {}

    public function index(Request $request)
    {
        $user  = $request->user();
        $query = FacedRecord::with(['familyMembers', 'assistanceRecords'])
            ->latest('date_registered');

        if ($user->isBarangayStaff()) {
            $query->where('barangay', $user->assigned_barangay);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(
                fn($q) => $q
                    ->where('last_name', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%")
            );
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('barangay') && $user->isAdmin()) {
            $query->where('barangay', $request->barangay);
        }

        $records = $query->paginate(15)->withQueryString();

        return Inertia::render('RecordsList', [
            'records'  => $records,
            'filters'  => $request->only(['search', 'status', 'barangay']),
        ]);
    }

    public function create()
    {
        return Inertia::render('FacedForm', [
            'record' => null,
        ]);
    }

    public function store(Request $request)
    {
        // ✅ After — all fields included
        $validated = $request->validate([
            'barangay'           => 'required|string',
            'last_name'          => 'required|string|max:100',
            'first_name'         => 'required|string|max:100',
            'middle_name'        => 'nullable|string|max:100',
            'name_extension'     => 'nullable|string|max:20',
            'civil_status'       => 'required|string',
            'birthdate'          => 'required|date',
            'sex'                => 'required|in:Male,Female',
            'contact_primary'    => 'required|string|max:20',
            'permanent_address'  => 'required|string',
            'shelter_damage'     => 'required|string',
            'house_ownership'    => 'required|string',
            'consent_checked'    => 'required|boolean',
            'monthly_income'     => 'required|numeric|min:0',
            'region'             => 'nullable|string|max:100',
            'province'           => 'nullable|string|max:100',
            'municipality'       => 'nullable|string|max:100',
            'district'           => 'nullable|string|max:100',
            'evacuation_center'  => 'nullable|string|max:150',
            'mothers_maiden_name' => 'nullable|string|max:150',
            'religion'           => 'nullable|string|max:100',
            'occupation'         => 'nullable|string|max:100',
            'age'                => 'nullable|integer',
            'birthplace'         => 'nullable|string|max:150',
            'contact_alternate'  => 'nullable|string|max:20',
            'is_4ps'             => 'nullable|boolean',
            'is_ip'              => 'nullable|boolean',
            'ip_group'           => 'nullable|string|max:100',
            'others_category'    => 'nullable|string|max:150',
            'id_presented'       => 'nullable|string|max:100',
            'id_number'          => 'nullable|string|max:100',
            'bank_provider'      => 'nullable|string|max:100',
            'account_name'       => 'nullable|string|max:150',
            'account_type'       => 'nullable|in:Savings,Checking,E-Wallet',
            'account_number'     => 'nullable|string|max:100',
            'signed_form_url'    => 'nullable|string|max:500',
            'remarks'            => 'nullable|string',
            'family_members'     => 'nullable|array',
            'family_members.*.name'            => 'required|string',
            'family_members.*.relationship'    => 'required|string',
            'family_members.*.birthdate'       => 'required|date',
            'family_members.*.sex'             => 'required|in:Male,Female',
            'family_members.*.vulnerabilities' => 'nullable|array',
        ]);

        $year   = now()->year;
        $count  = FacedRecord::whereYear('created_at', $year)->count() + 1;
        $serial = 'FACED-' . $year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

        $record = FacedRecord::create([
            'id'             => Str::uuid(),
            'serial_number'  => $serial,
            'status'         => 'Submitted',
            'date_registered' => now()->toDateString(),
            'created_by'     => $request->user()->id,
            ...$validated,
        ]);

        // Save family members
        if (!empty($validated['family_members'])) {
            foreach ($validated['family_members'] as $memberData) {
                $member = FamilyMember::create([
                    'id'              => Str::uuid(),
                    'faced_record_id' => $record->id,
                    'name'            => $memberData['name'],
                    'relationship'    => $memberData['relationship'],
                    'birthdate'       => $memberData['birthdate'],
                    'age'             => $memberData['age'] ?? null,
                    'sex'             => $memberData['sex'],
                    'birthplace'      => $memberData['birthplace'] ?? null,
                    'occupation'      => $memberData['occupation'] ?? null,
                    'educational_attainment' => $memberData['educational_attainment'] ?? null,
                ]);

                foreach ($memberData['vulnerabilities'] ?? [] as $vuln) {
                    FamilyMemberVulnerability::create([
                        'family_member_id'   => $member->id,
                        'vulnerability_type' => $vuln,
                    ]);
                }
            }
        }

        // Calculate and save VAI score
        $record->refresh()->load('familyMembers.vulnerabilities');
        $record->update(['vai_score' => $this->vaiService->calculate($record)]);

        return redirect()->route('records.index')
            ->with('success', "Record {$serial} submitted successfully.");
    }

    public function show(FacedRecord $record)
    {
        $record->load(['familyMembers.vulnerabilities', 'assistanceRecords', 'createdBy']);

        return Inertia::render('FacedForm', [
            'record' => $this->formatRecord($record),
        ]);

        return Inertia::render('FacedPrint', [
            'record' => $record->load(['familyMembers.vulnerabilities', 'assistanceRecords'])
        ]);
    }

    public function edit(FacedRecord $record)
    {
        $user = request()->user();

        // Only allow editing if Submitted or Returned
        if ($record->status === 'Validated') {
            abort(403, 'Validated records cannot be edited.');
        }

        // Barangay Staff can only edit their own barangay
        if ($user->isBarangayStaff() && $record->barangay !== $user->assigned_barangay) {
            abort(403, 'You can only edit records from your assigned barangay.');
        }

        $record->load(['familyMembers.vulnerabilities', 'assistanceRecords']);

        return Inertia::render('FacedForm', [
            'record' => $this->formatRecord($record),
        ]);
    }

    public function update(Request $request, FacedRecord $record)
    {
        $user = $request->user();

        // Admin can validate or return
        if ($user->isAdmin()) {
            $request->validate([
                'status'  => 'required|in:Validated,Returned',
                'remarks' => 'nullable|string',
            ]);

            $record->update([
                'status'  => $request->status,
                'remarks' => $request->remarks,
            ]);

            return redirect()->route('records.index')
                ->with('success', "Record {$record->serial_number} has been {$request->status}.");
        }

        // ✅ After — all fields included
        $validated = $request->validate([
            'barangay'           => 'required|string',
            'last_name'          => 'required|string|max:100',
            'first_name'         => 'required|string|max:100',
            'middle_name'        => 'nullable|string|max:100',
            'name_extension'     => 'nullable|string|max:20',
            'civil_status'       => 'required|string',
            'birthdate'          => 'required|date',
            'sex'                => 'required|in:Male,Female',
            'contact_primary'    => 'required|string|max:20',
            'permanent_address'  => 'required|string',
            'shelter_damage'     => 'required|string',
            'house_ownership'    => 'required|string',
            'consent_checked'    => 'required|boolean',
            'monthly_income'     => 'required|numeric|min:0',
            'region'             => 'nullable|string|max:100',
            'province'           => 'nullable|string|max:100',
            'municipality'       => 'nullable|string|max:100',
            'district'           => 'nullable|string|max:100',
            'evacuation_center'  => 'nullable|string|max:150',
            'mothers_maiden_name' => 'nullable|string|max:150',
            'religion'           => 'nullable|string|max:100',
            'occupation'         => 'nullable|string|max:100',
            'age'                => 'nullable|integer',
            'birthplace'         => 'nullable|string|max:150',
            'contact_alternate'  => 'nullable|string|max:20',
            'is_4ps'             => 'nullable|boolean',
            'is_ip'              => 'nullable|boolean',
            'ip_group'           => 'nullable|string|max:100',
            'others_category'    => 'nullable|string|max:150',
            'id_presented'       => 'nullable|string|max:100',
            'id_number'          => 'nullable|string|max:100',
            'bank_provider'      => 'nullable|string|max:100',
            'account_name'       => 'nullable|string|max:150',
            'account_type'       => 'nullable|in:Savings,Checking,E-Wallet',
            'account_number'     => 'nullable|string|max:100',
            'signed_form_url'    => 'nullable|string|max:500',
            'remarks'            => 'nullable|string',
            'family_members'     => 'nullable|array',
            'family_members.*.name'            => 'required|string',
            'family_members.*.relationship'    => 'required|string',
            'family_members.*.birthdate'       => 'required|date',
            'family_members.*.sex'             => 'required|in:Male,Female',
            'family_members.*.vulnerabilities' => 'nullable|array',
        ]);

        $record->update($validated);

        // Re-sync family members
        if (isset($validated['family_members'])) {
            $record->familyMembers()->delete();
            foreach ($validated['family_members'] as $memberData) {
                $member = FamilyMember::create([
                    'id'              => Str::uuid(),
                    'faced_record_id' => $record->id,
                    ...$memberData,
                ]);
                foreach ($memberData['vulnerabilities'] ?? [] as $vuln) {
                    FamilyMemberVulnerability::create([
                        'family_member_id'   => $member->id,
                        'vulnerability_type' => $vuln,
                    ]);
                }
            }
        }

        // Recalculate VAI
        $record->refresh()->load('familyMembers.vulnerabilities');
        $record->update(['vai_score' => $this->vaiService->calculate($record)]);

        return redirect()->route('records.index')
            ->with('success', "Record {$record->serial_number} updated successfully.");
    }

    public function validateRecord(FacedRecord $record)
    {
        if (!request()->user()->isAdmin()) abort(403);

        $record->update(['status' => 'Validated']);

        return back()->with('success', "Record {$record->serial_number} has been Validated.");
    }

    public function returnRecord(FacedRecord $record)
    {
        if (!request()->user()->isAdmin()) abort(403);

        $record->update(['status' => 'Returned']);

        return back()->with('success', "Record {$record->serial_number} has been Returned.");
    }

    public function destroy(FacedRecord $record)
    {
        if (!request()->user()->isAdmin()) {
            abort(403);
        }

        $serial = $record->serial_number;
        $record->delete();

        return redirect()->route('records.index')
            ->with('success', "Record {$serial} has been deleted.");
    }

    private function formatRecord(FacedRecord $record): array
    {
        return [
            ...$record->toArray(),
            'family_members' => $record->familyMembers->map(fn($m) => [
                ...$m->toArray(),
                'vulnerabilities' => $m->vulnerabilities->pluck('vulnerability_type'),
            ]),
            'assistances' => $record->assistanceRecords,
        ];
    }
}
