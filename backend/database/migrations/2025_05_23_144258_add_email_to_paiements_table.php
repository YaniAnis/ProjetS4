<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEmailToPaiementsTable extends Migration
{
    public function up()
    {
        Schema::table('paiements', function (Blueprint $table) {
            $table->string('email')->nullable()->after('user_id'); // Add the email column
        });
    }

    public function down()
    {
        Schema::table('paiements', function (Blueprint $table) {
            $table->dropColumn('email'); // Remove the email column if rolled back
        });
    }
}
