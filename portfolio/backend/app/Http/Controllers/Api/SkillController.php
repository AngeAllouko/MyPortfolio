<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index() { return Skill::all(); }
    public function store(Request $request) { return Skill::create($request->all()); }
    public function show(Skill $skill) { return $skill; }
    public function update(Request $request, Skill $skill) { $skill->update($request->all()); return $skill; }
    public function destroy(Skill $skill) { $skill->delete(); return response()->json(null, 204); }
}