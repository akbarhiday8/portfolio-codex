<?php

namespace Database\Seeders;

use App\Models\ToolCategory;
use Illuminate\Database\Seeder;

class ToolCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Website', 'Landing Page', 'Data Analyst'];

        foreach ($categories as $category) {
            ToolCategory::updateOrCreate(['name' => $category]);
        }
    }
}
