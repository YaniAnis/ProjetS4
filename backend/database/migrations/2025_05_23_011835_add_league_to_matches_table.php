<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            // Ajoute la colonne league si elle n'existe pas déjà
            if (!Schema::hasColumn('matches', 'league')) {
                $table->string('league')->nullable()->after('equipe2');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            // Supprime la colonne league si elle existe
            if (Schema::hasColumn('matches', 'league')) {
                $table->dropColumn('league');
            }
        });
    }
};
