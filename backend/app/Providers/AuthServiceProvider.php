<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Tidak perlu Sanctum::ignoreMigrations() kalau pakai Laravel 12
        // Laravel otomatis handle migration Sanctum

        // Gate opsional untuk role
        // Gate::define('is-admin', fn($user) => $user->role === 'admin');
    }
}
