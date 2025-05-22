<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->string('equipe1');
            $table->string('equipe2');
            $table->string('league');
            $table->date('date');
            $table->string('heure');
            $table->unsignedBigInteger('stade_id');
            $table->timestamps();

            $table->foreign('stade_id')->references('id')->on('stades')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
