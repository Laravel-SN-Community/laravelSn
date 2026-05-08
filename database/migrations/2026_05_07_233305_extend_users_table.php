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
        Schema::table('users', function (Blueprint $table): void {
            $table->string('avatar_path')->nullable()->after('username');
            $table->text('bio')->nullable()->after('avatar_path');
            $table->string('twitter_handle')->nullable()->after('bio');
            $table->string('github_handle')->nullable()->after('twitter_handle');
            $table->string('linkedin_handle')->nullable()->after('github_handle');
            $table->string('website_url')->nullable()->after('linkedin_handle');
            $table->string('location')->nullable()->after('website_url');
            $table->boolean('newsletter_opt_in')->default(false)->after('location');
            $table->timestamp('last_login_at')->nullable()->after('newsletter_opt_in');
            $table->timestamp('last_active_at')->nullable()->after('last_login_at');
            $table->json('settings')->nullable()->after('last_active_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
