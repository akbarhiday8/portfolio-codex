<?php

namespace Database\Seeders;

use App\Models\ProjectCategory;
use Illuminate\Database\Seeder;

class ProjectCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Website', 'description' => 'Aplikasi web publik atau internal.'],
            ['name' => 'Landing Page', 'description' => 'Halaman promosi satu halaman.'],
            ['name' => 'Data Analyst', 'description' => 'Proyek analisis data dan dashboard.'],
        ];

        foreach ($categories as $category) {
            ProjectCategory::updateOrCreate(['name' => $category['name']], $category);
        }
    }
}
