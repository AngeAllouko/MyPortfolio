<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index() { return Project::all(); }
    public function store(Request $request) { return Project::create($request->all()); }
    public function show(Project $project) { return $project; }
    public function update(Request $request, Project $project) { $project->update($request->all()); return $project; }
    public function destroy(Project $project) { $project->delete(); return response()->json(null, 204); }
}