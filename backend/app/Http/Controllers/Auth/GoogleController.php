<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::updateOrCreate(
                ['google_id' => $googleUser->getId()],
                [
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => bcrypt(uniqid()),
                ]
            );

            Auth::login($user);

            // Buat token untuk frontend
            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect ke frontend bawa tokena
            return redirect("http://127.0.0.1:5173?token=$token");
        } catch (\Exception $e) {
            return redirect("http://127.0.0.1:5173/login?error=" . urlencode($e->getMessage()));
        }
    }
}