<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create(); // Create 10 test users

        // Add admin users
        $admins = [
            [
                'name' => 'Admin FooTiX',
                'email' => 'admin@foottickets.com',
                'password' => Hash::make('admin1234'), // Change password as needed
                'role' => 'admin',
            ],
            [
                'name' => 'Admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make('admin1234'), // Change password as needed
                'role' => 'admin',
            ],
        ];

        foreach ($admins as $admin) {
            User::updateOrCreate(
                ['email' => $admin['email']],
                $admin
            );
        }
    }
}
