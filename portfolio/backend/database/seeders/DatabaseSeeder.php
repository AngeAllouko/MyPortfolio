<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profile;
use App\Models\Diploma;
use App\Models\Experience;
use App\Models\Skill;
use App\Models\Project;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Profile
        Profile::create([
            'name' => 'Allouko Essigan Daniel Ange Nathanael',
            'title' => 'Etudiant MIAGE — Developpeur Full Stack',
            'bio' => 'Passionné par le développement web full stack, je construis des applications modernes avec React et Laravel.',
            'email' => 'daniel.allouko@example.com',
            'phone' => '+225 01 02 03 04 05',
            'location' => 'Abidjan, Côte d\'Ivoire',
            'linkedin_url' => 'https://linkedin.com/in/danielallouko',
            'github_url' => 'https://github.com/danielallouko',
            'photo_url' => '/images/profile.jpg',
        ]);

        // Diplomas
        Diploma::create([
            'title' => 'Master MIAGE',
            'institution' => 'Université Felix Houphouët-Boigny',
            'year' => '2026',
            'description' => 'Management Informatique et Génie Logiciel'
        ]);

        // Experiences
        Experience::create([
            'job_title' => 'Développeur Full Stack',
            'company' => 'Stage Entreprise',
            'start_date' => '2025-01-01',
            'end_date' => '2025-06-30',
            'description' => 'Développement d\'applications web avec React et Laravel.',
            'location' => 'Abidjan'
        ]);

        // Skills
        Skill::create(['name' => 'React', 'category' => 'Frontend', 'level' => 85]);
        Skill::create(['name' => 'Laravel', 'category' => 'Backend', 'level' => 80]);
        Skill::create(['name' => 'MySQL', 'category' => 'Base de données', 'level' => 75]);

        // Projects
        Project::create([
            'title' => 'Portfolio Personnel',
            'description' => 'Application full stack React + Laravel',
            'technologies' => ['React', 'Laravel', 'MySQL'],
            'featured' => true
        ]);
    }
}