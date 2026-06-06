<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show()
    {
        return response()->json(Profile::first());
    }

    public function store(Request $request)
    {
        $existing = Profile::first();
        if ($existing) {
            return $this->update($request, $existing->id);
        }
        $data    = $this->handleUploads($request, null);
        $profile = Profile::create($data);
        return response()->json($profile, 201);
    }

    public function update(Request $request, $id)
    {
        $profile = Profile::first();
        if (!$profile) {
            return response()->json(['message' => 'Profil introuvable'], 404);
        }
        $data = $this->handleUploads($request, $profile);
        $profile->update($data);
        return response()->json($profile->fresh());
    }

    private function handleUploads(Request $request, ?Profile $existing): array
    {
        $data = $request->except(['photo_file', 'cv_file', '_method']);

        // ✅ Fix Windows/MINGW : utiliser allFiles() au lieu de hasFile()
        $files = $request->allFiles();

        // ── Photo ──
        if (isset($files['photo_file'])) {
            $file = $files['photo_file'];

            if ($file->isValid()) {
                // Supprimer l'ancienne photo
                if ($existing?->photo_url) {
                    Storage::disk('public')->delete(
                        str_replace('/storage/', '', $existing->photo_url)
                    );
                }
                $filename = 'photo_' . time() . '.' . $file->getClientOriginalExtension();
                $path     = $file->storeAs('uploads/photos', $filename, 'public');
                $data['photo_url'] = '/storage/' . $path;
            }
        }

        // ── CV ──
        if (isset($files['cv_file'])) {
            $file = $files['cv_file'];

            if ($file->isValid()) {
                if ($existing?->cv_url) {
                    Storage::disk('public')->delete(
                        str_replace('/storage/', '', $existing->cv_url)
                    );
                }
                $filename = 'cv_' . time() . '.' . $file->getClientOriginalExtension();
                $path     = $file->storeAs('uploads/cvs', $filename, 'public');
                $data['cv_url'] = '/storage/' . $path;
            }
        }

        return $data;
    }
}