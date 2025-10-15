<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ProfileSeeder::class,
            SkillSeeder::class,
            ToolTypeSeeder::class,
            ToolCategorySeeder::class,
            ProjectCategorySeeder::class,
            ToolSeeder::class,
            ProjectSeeder::class,
        ]);
    }
}
