<?php

namespace Database\Seeders;

use App\Models\Tool;
use App\Models\ToolCategory;
use App\Models\ToolType;
use Illuminate\Database\Seeder;

class ToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typeProgramming = ToolType::firstWhere('name', 'Pemrograman');
        $typeDesign = ToolType::firstWhere('name', 'Desain');
        $categoryWebsite = ToolCategory::firstWhere('name', 'Website');
        $categoryLanding = ToolCategory::firstWhere('name', 'Landing Page');

        if (! $typeProgramming || ! $categoryWebsite) {
            return;
        }

        $tools = [
            ['name' => 'React', 'type' => $typeProgramming, 'category' => $categoryWebsite, 'color' => '#61dafb'],
            ['name' => 'Laravel', 'type' => $typeProgramming, 'category' => $categoryWebsite, 'color' => '#f9322c'],
            ['name' => 'Tailwind CSS', 'type' => $typeDesign ?? $typeProgramming, 'category' => $categoryLanding ?? $categoryWebsite, 'color' => '#38bdf8'],
        ];

        foreach ($tools as $tool) {
            Tool::updateOrCreate(
                ['name' => $tool['name']],
                [
                    'tool_type_id' => $tool['type']->id,
                    'tool_category_id' => $tool['category']->id,
                    'icon_color' => $tool['color'],
                ]
            );
        }
    }
}
