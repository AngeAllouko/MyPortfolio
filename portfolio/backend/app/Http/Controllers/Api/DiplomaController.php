<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Diploma;
use Illuminate\Http\Request;

class DiplomaController extends Controller
{
    public function index() { return Diploma::all(); }
    public function store(Request $request) { return Diploma::create($request->all()); }
    public function show(Diploma $diploma) { return $diploma; }
    public function update(Request $request, Diploma $diploma) { $diploma->update($request->all()); return $diploma; }
    public function destroy(Diploma $diploma) { $diploma->delete(); return response()->json(null, 204); }
}