<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            ['name' => 'JavaScript', 'level' => 90],
            ['name' => 'React', 'level' => 88],
            ['name' => 'Laravel', 'level' => 92],
            ['name' => 'Tailwind CSS', 'level' => 85],
        ];

        foreach ($skills as $skill) {
            Skill::updateOrCreate(
                ['name' => $skill['name']],
                ['level' => $skill['level']]
            );
        }
    }
}
