<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Log; // Ensure the Log facade is imported
use Illuminate\Support\Facades\Schema; // Import the Schema facade

class UserController extends Controller
{
    public function index()
    {
        Log::info('index method called'); // Debugging log
        $users = User::select('id', 'name', 'email', 'role', 'created_at')->get();
        return response()->json($users);
    }

    public function getUserStats()
    {
        Log::info('getUserStats method called'); // Debugging log

        $totalUsers = User::count();
        $newUsersToday = User::whereDate('created_at', now()->toDateString())->count();

        // Only count active users if the column exists
        $activeUsers = 0;
        if (Schema::hasColumn('users', 'last_activity')) {
            $activeUsers = User::whereNotNull('last_activity')
                ->where('last_activity', '>=', now()->subDays(7))
                ->count();
        }

        // Churn rate logic (set to 0% if you don't have soft deletes)
        $churnRate = '0%';

        return response()->json([
            'totalUsers' => $totalUsers,
            'newUsersToday' => $newUsersToday,
            'activeUsers' => $activeUsers,
            'churnRate' => $churnRate,
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }
}
