<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'admin@example.com')->first();

        if (! $user) {
            return;
        }

        Profile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'name' => 'Akbar Nur Hidayanto',
                'title' => 'Full Stack Web Developer',
                'motto' => 'Membangun solusi digital berdampak',
                'about' => 'Saya adalah seorang pengembang fullstack berfokus pada pengalaman pengguna dan performa aplikasi.',
            ]
        );
    }
}
