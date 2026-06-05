<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index() { return Experience::all(); }
    public function store(Request $request) { return Experience::create($request->all()); }
    public function show(Experience $experience) { return $experience; }
    public function update(Request $request, Experience $experience) { $experience->update($request->all()); return $experience; }
    public function destroy(Diploma $diploma) { $diploma->delete(); return response()->json(null, 204); }
}