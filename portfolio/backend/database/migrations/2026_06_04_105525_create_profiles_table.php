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
    Schema::create('profiles', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('title');
        $table->text('bio')->nullable();
        $table->string('email');
        $table->string('phone')->nullable();
        $table->string('location')->nullable();
        $table->string('linkedin_url')->nullable();
        $table->string('github_url')->nullable();
        $table->string('photo_url')->nullable();
        $table->json('social_links')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
