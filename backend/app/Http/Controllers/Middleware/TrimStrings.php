<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\TrimStrings as Middleware;

class TrimStrings extends Middleware
{
    protected $except = [
        // Tambahkan field yang tidak ingin di-trim, misal: 'password_confirmation'
    ];
}
