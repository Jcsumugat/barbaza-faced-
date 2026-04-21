<?php

namespace App\Http\Controllers;

use App\Models\AssistanceRecord;
use App\Models\FacedRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AssistanceRecordController extends Controller
{
    public function store(Request $request, FacedRecord $record)
    {
        $validated = $request->validate([
            'recipient_member_id' => 'nullable|string',
            'recipient_name'      => 'required|string|max:200',
            'date'                => 'required|date',
            'emergency_type'      => 'required|string|max:150',
            'assistance_provided' => 'required|string|max:200',
            'unit'                => 'required|string|max:50',
            'quantity'            => 'required|numeric|min:0',
            'cost'                => 'required|numeric|min:0',
            'provider'            => 'nullable|string|max:150',
        ]);

        AssistanceRecord::create([
            'id'             => Str::uuid(),
            'faced_record_id' => $record->id,
            'status'         => 'Pending Approval',
            ...$validated,
        ]);

        return redirect()->route('records.show', $record->id)
            ->with('success', 'Assistance record added successfully.');
    }
    public function index(Request $request)
    {
        $filters = [
            'month'  => $request->input('month'),
            'status' => $request->input('status'),
            'search' => $request->input('search'),
        ];

        $query = AssistanceRecord::with(['facedRecord' => fn($q) => $q->select('id', 'serial_number', 'barangay')])
            ->when($filters['month'],  fn($q) => $q->whereMonth('date', $filters['month']))
            ->when($filters['status'], fn($q) => $q->where('status', $filters['status']))
            ->when($filters['search'], fn($q) => $q->where(function ($q2) use ($filters) {
                $q2->where('recipient_name', 'like', "%{$filters['search']}%")
                    ->orWhere('emergency_type', 'like', "%{$filters['search']}%")
                    ->orWhere('assistance_provided', 'like', "%{$filters['search']}%");
            }))
            ->orderBy('date', 'desc');

        $all = $query->get();

        $assistance_records = $all->map(fn($a) => [
            'id'                => $a->id,
            'faced_record_id'   => $a->faced_record_id,
            'serial_number'     => $a->facedRecord?->serial_number,
            'barangay'          => $a->facedRecord?->barangay,
            'recipient_name'    => $a->recipient_name,
            'date'              => $a->date?->format('Y-m-d'),
            'emergency_type'    => $a->emergency_type,
            'assistance_provided' => $a->assistance_provided,
            'unit'              => $a->unit,
            'quantity'          => $a->quantity,
            'cost'              => $a->cost,
            'provider'          => $a->provider,
            'status'            => $a->status,
        ])->values();

        $summary = [
            'total'      => $all->count(),
            'pending'    => $all->where('status', 'Pending Approval')->count(),
            'approved'   => $all->where('status', 'Approved')->count(),
            'total_cost' => $all->sum('cost'),
        ];

        return Inertia::render('Assistance', [
            'assistance_records' => $assistance_records,
            'summary'            => $summary,
            'filters'            => $filters,
        ]);
    }
    public function approve(Request $request, FacedRecord $record, AssistanceRecord $assistance)
    {
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        $assistance->update(['status' => 'Approved']);

        return back()->with('success', 'Assistance record approved.');
    }

    public function lock(Request $request, FacedRecord $record, AssistanceRecord $assistance)
    {
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        $assistance->update(['status' => 'Locked']);

        return back()->with('success', 'Assistance record locked.');
    }


    public function show(Request $request, FacedRecord $record)
    {
        $record->load([
            'familyMembers.vulnerabilities',
            'assistanceRecords' => fn($q) => $q->orderBy('date'),
        ]);

        return Inertia::render('Assistance', [

            // ── core record fields ──────────────────────────────────────
            'record' => [
                'id'                  => $record->id,
                'serial_number'       => $record->serial_number,
                'status'              => $record->status,

                // location
                'region'              => $record->region,
                'province'            => $record->province,
                'municipality'        => $record->municipality,
                'district'            => $record->district,
                'barangay'            => $record->barangay,
                'evacuation_center'   => $record->evacuation_center,

                // head of family
                'last_name'           => $record->last_name,
                'first_name'          => $record->first_name,
                'middle_name'         => $record->middle_name,
                'name_extension'      => $record->name_extension,
                'civil_status'        => $record->civil_status,
                'mothers_maiden_name' => $record->mothers_maiden_name,
                'religion'            => $record->religion,
                'occupation'          => $record->occupation,
                'birthdate'           => $record->birthdate?->format('Y-m-d'),
                'age'                 => $record->age,
                'sex'                 => $record->sex,
                'birthplace'          => $record->birthplace,
                'monthly_income'      => $record->monthly_income,
                'id_presented'        => $record->id_presented,
                'id_number'           => $record->id_number,
                'contact_primary'     => $record->contact_primary,
                'contact_alternate'   => $record->contact_alternate,
                'permanent_address'   => $record->permanent_address,

                // categories
                'is_4ps'              => $record->is_4ps,
                'is_ip'               => $record->is_ip,
                'ip_group'            => $record->ip_group,

                // account
                'bank_provider'       => $record->bank_provider,
                'account_name'        => $record->account_name,
                'account_type'        => $record->account_type,
                'account_number'      => $record->account_number,

                // housing
                'house_ownership'     => $record->house_ownership,
                'shelter_damage'      => $record->shelter_damage,

                // meta
                'date_registered'     => $record->date_registered?->format('Y-m-d'),
                'vai_score'           => $record->vai_score,
                'remarks'             => $record->remarks,
            ],

            // ── family members ──────────────────────────────────────────
            'members' => $record->familyMembers->map(fn($m) => [
                'id'                     => $m->id,
                'name'                   => $m->name,
                'relationship'           => $m->relationship,
                'birthdate'              => $m->birthdate?->format('Y-m-d'),
                'age'                    => $m->age,
                'sex'                    => $m->sex,
                'birthplace'             => $m->birthplace,
                'occupation'             => $m->occupation,
                'educational_attainment' => $m->educational_attainment,
                'vulnerabilities'        => $m->vulnerabilities->pluck('vulnerability_type')->toArray(),
            ]),

            // ── assistance records ──────────────────────────────────────
            'assistance_records' => $record->assistanceRecords->map(fn($a) => [
                'id'                  => $a->id,
                'date'                => $a->date?->format('Y-m-d'),
                'recipient_name'      => $a->recipient_name,
                'recipient_member_id' => $a->recipient_member_id,
                'emergency_type'      => $a->emergency_type,
                'assistance_provided' => $a->assistance_provided,
                'unit'                => $a->unit,
                'quantity'            => $a->quantity,
                'cost'                => $a->cost,
                'provider'            => $a->provider,
                'status'              => $a->status,
            ]),

            // ── permissions hint ────────────────────────────────────────
            'can' => [
                'approve' => $request->user()->isAdmin(),
                'lock'    => $request->user()->isAdmin(),
                'delete'  => $request->user()->isAdmin(),
            ],
        ]);
    }


    // ════════════════════════════════════════════════════════════════════════
    //  AssistanceRecordController  —  add destroy() method
    // ════════════════════════════════════════════════════════════════════════

    public function destroy(Request $request, FacedRecord $record, AssistanceRecord $assistance)
    {
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        // Only allow deletion while still pending
        if ($assistance->status !== 'Pending Approval') {
            return back()->with('error', 'Only pending assistance records can be deleted.');
        }

        $assistance->delete();

        return back()->with('success', 'Assistance record deleted.');
    }
}
