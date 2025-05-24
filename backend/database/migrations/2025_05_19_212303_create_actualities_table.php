<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('actualities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content'); // Remplace string par text pour permettre plus de texte
            $table->text('description')->nullable();
            $table->string('readTime')->nullable();
            $table->string('image_url')->nullable(); // Remplace 'image' par 'image_url'
            $table->string('type')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actualities');
    }
};
