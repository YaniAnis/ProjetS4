<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            if (!Schema::hasColumn('matches', 'parking_places')) {
                $table->integer('parking_places')->default(0);
            }
        });
        
        Schema::table('tickets', function (Blueprint $table) {
            if (!Schema::hasColumn('tickets', 'parking')) {
                $table->string('parking')->default('non');
            }
        });
    }

    public function down(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->dropColumn('parking_places');
        });
        
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn('parking');
        });
    }
};
