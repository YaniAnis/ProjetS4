<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('actualities', function (Blueprint $table) {
            if (!Schema::hasColumn('actualities', 'type')) {
                $table->string('type')->nullable();
            }
            if (!Schema::hasColumn('actualities', 'image')) {
                $table->string('image')->nullable();
            }
            if (!Schema::hasColumn('actualities', 'readTime')) {
                $table->integer('readTime')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('actualities', function (Blueprint $table) {
            if (Schema::hasColumn('actualities', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('actualities', 'image')) {
                $table->dropColumn('image');
            }
            if (Schema::hasColumn('actualities', 'readTime')) {
                $table->dropColumn('readTime');
            }
        });
    }
};
