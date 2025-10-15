<?php

namespace Database\Seeders;

use App\Models\Feature;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Tool;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projectData = [
            [
                'name' => 'Portfolio Website',
                'description' => 'Website portfolio pribadi dengan integrasi CMS ringan.',
                'link_url' => 'https://example.com/portfolio',
                'category' => 'Website',
                'features' => [
                    'UI responsif dan cepat',
                    'Integrasi ke API publik',
                ],
                'tools' => ['React', 'Tailwind CSS', 'Laravel'],
            ],
            [
                'name' => 'Admin Dashboard',
                'description' => 'Dashboard admin untuk mengelola konten portfolio.',
                'link_url' => 'https://example.com/admin',
                'category' => 'Landing Page',
                'features' => [
                    'Autentikasi Sanctum',
                    'Upload berkas dan gambar',
                ],
                'tools' => ['Laravel', 'React'],
            ],
        ];

        foreach ($projectData as $data) {
            $project = Project::updateOrCreate(
                ['name' => $data['name']],
                Arr::only($data, ['description', 'link_url']) + [
                    'project_category_id' => ProjectCategory::where('name', $data['category'])->value('id'),
                ]
            );

            $toolIds = Tool::whereIn('name', $data['tools'])->pluck('id');
            $project->tools()->sync($toolIds);

            $project->features()->delete();
            foreach ($data['features'] as $text) {
                $project->features()->create(['text' => $text]);
            }
        }
    }
}
