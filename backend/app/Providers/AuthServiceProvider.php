<?php

namespace App\Providers;

use App\Models\Profile;
use App\Policies\ProfilePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::policy(Profile::class, ProfilePolicy::class);
    }
}
