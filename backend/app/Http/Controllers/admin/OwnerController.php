<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class OwnerController extends Controller
{
    // Get all admins
    public function getAdmins()
    {
        $admins = User::where('role', 'admin')->get();

        return response()->json([
            'success' => true,
            'data' => $admins
        ], 200);
    }

    // Add new admin
    public function storeAdmin(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $admin = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'admin',
            'is_active'=> true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Admin berhasil ditambahkan',
            'data' => $admin
        ], 201);
    }

    // Toggle Active
    public function toggleActive($id)
    {
        $admin = User::findOrFail($id);
        $admin->is_active = !$admin->is_active;
        $admin->save();

        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diperbarui',
            'data' => $admin
        ]);
    }

    // Delete Admin
    public function deleteAdmin($id)
    {
        $admin = User::findOrFail($id);
        $admin->delete();

        return response()->json([
            'success' => true,
            'message' => 'Admin berhasil dihapus'
        ]);
    }
}
