<?php

namespace Database\Seeders;

use App\Models\ToolType;
use Illuminate\Database\Seeder;

class ToolTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = ['Pemrograman', 'Desain', 'Produktivitas'];

        foreach ($types as $type) {
            ToolType::updateOrCreate(['name' => $type]);
        }
    }
}
