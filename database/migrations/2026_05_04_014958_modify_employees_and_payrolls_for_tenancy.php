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
        Schema::table('employees', function (Blueprint $table) {
            $table->string('email')->unique()->after('name');
            $table->string('password')->after('email');
            $table->rememberToken()->after('password');
            $table->dropForeign(['user_id']);
            $table->renameColumn('user_id', 'room_id');
            $table->foreign('room_id')->references('id')->on('rooms')->cascadeOnDelete();
        });

        Schema::table('payrolls', function (Blueprint $table) {
            $table->foreignId('room_id')->after('id')->constrained('rooms')->cascadeOnDelete();
            $table->json('details')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            $table->dropForeign(['room_id']);
            $table->dropColumn(['room_id', 'details']);
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['room_id']);
            $table->renameColumn('room_id', 'user_id');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->dropColumn(['email', 'password', 'remember_token']);
        });
    }
};
