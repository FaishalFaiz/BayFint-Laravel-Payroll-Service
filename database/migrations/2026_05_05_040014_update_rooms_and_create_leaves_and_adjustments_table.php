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
        Schema::table('rooms', function (Blueprint $table) {
            $table->integer('late_grace_period')->default(0);
            $table->integer('overtime_min_duration')->default(0);
            $table->string('late_rule_type')->default('variable'); // fixed | variable
            $table->decimal('late_amount', 15, 2)->default(0);
            $table->string('overtime_rule_type')->default('variable'); // fixed | variable
            $table->decimal('overtime_amount', 15, 2)->default(0);
            $table->decimal('absence_amount', 15, 2)->default(0);
        });

        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->text('reason');
            $table->string('status')->default('pending'); // pending | approved | rejected
            $table->unsignedBigInteger('room_id'); // For tenancy
            $table->timestamps();
        });

        Schema::create('payroll_adjustments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('amount', 15, 2);
            $table->string('type'); // allowance | deduction
            $table->integer('month');
            $table->integer('year');
            $table->unsignedBigInteger('room_id'); // For tenancy
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_adjustments');
        Schema::dropIfExists('leaves');
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn([
                'late_grace_period',
                'overtime_min_duration',
                'late_rule_type',
                'late_amount',
                'overtime_rule_type',
                'overtime_amount',
                'absence_amount'
            ]);
        });
    }
};
