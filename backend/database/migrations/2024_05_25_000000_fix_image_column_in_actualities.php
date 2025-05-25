<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('actualities', function (Blueprint $table) {
            // First ensure the old column is properly dropped if it exists
            if (Schema::hasColumn('actualities', 'image')) {
                $table->dropColumn('image');
            }
            // Make sure we have the correct image_url column
            if (!Schema::hasColumn('actualities', 'image_url')) {
                $table->string('image_url')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('actualities', function (Blueprint $table) {
            $table->string('image')->nullable();
            $table->dropColumn('image_url');
        });
    }
};
