<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PromoController extends Controller
{
    // GET semua promo
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Promo::all()
        ], 200);
    }

    // POST tambah promo
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string',
            'deskripsi' => 'required|string',
            'harga' => 'required|integer',
            'gambar' => 'nullable|image|max:2048'
        ]);

        $gambarPath = null;

        if ($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('promos', 'public');
        }

        $promo = Promo::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'gambar' => $gambarPath,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $promo
        ], 201);
    }

    // GET 1 promo
    public function show($id)
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json(['message' => 'Promo tidak ditemukan'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $promo
        ], 200);
    }

    // PUT update
    public function update(Request $request, $id)
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json(['message' => 'Promo tidak ditemukan'], 404);
        }

        $request->validate([
            'judul' => 'required|string',
            'deskripsi' => 'required|string',
            'harga' => 'required|integer',
            'gambar' => 'nullable|image|max:2048'
        ]);

        // Jika ada gambar baru
        if ($request->hasFile('gambar')) {
            if ($promo->gambar && Storage::disk('public')->exists($promo->gambar)) {
                Storage::disk('public')->delete($promo->gambar);
            }

            $promo->gambar = $request->file('gambar')->store('promos', 'public');
        }

        $promo->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $promo
        ], 200);
    }

    // DELETE promo
    public function destroy($id)
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json(['message' => 'Promo tidak ditemukan'], 404);
        }

        // Hapus file gambar
        if ($promo->gambar && Storage::disk('public')->exists($promo->gambar)) {
            Storage::disk('public')->delete($promo->gambar);
        }

        $promo->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Promo berhasil dihapus'
        ], 200);
    }
}
