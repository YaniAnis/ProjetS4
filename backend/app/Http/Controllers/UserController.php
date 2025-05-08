<<<<<<< HEAD
<?php

=======
>>>>>>> ca26c2be4aeee4b1b5d624080ae96e93304c8975
namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
<<<<<<< HEAD
    public function index()
    {
        return response()->json(User::all());
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
=======
    public function getUsers()
    {
        \Log::info('getUsers method called'); // Debugging log
        $users = User::select('id', 'name', 'email', 'created_at')->get();
        return response()->json($users);
    }

    public function getUserStats()
    {
        \Log::info('getUserStats method called'); // Debugging log
        $totalUsers = User::count();
        $newUsersToday = User::whereDate('created_at', now()->toDateString())->count();

        return response()->json([
            'totalUsers' => $totalUsers,
            'newUsersToday' => $newUsersToday,
        ]);
>>>>>>> ca26c2be4aeee4b1b5d624080ae96e93304c8975
    }
}
