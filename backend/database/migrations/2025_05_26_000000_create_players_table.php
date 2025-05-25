<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('poste');  // Position like 'ATT', 'DEF', etc.
            $table->integer('maillot'); // Jersey number
            $table->integer('matches')->default(0);
            $table->integer('buts')->default(0);  // Goals
            $table->integer('passes')->default(0); // Assists
            $table->decimal('note', 3, 1)->default(0.0); // Rating
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('players');
    }
};
