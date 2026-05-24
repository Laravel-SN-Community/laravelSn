<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('threads', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('solution_reply_id')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('body');
            $table->boolean('is_locked')->default(false);
            $table->boolean('is_pinned')->default(false);
            $table->unsignedInteger('replies_count')->default(0);
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamp('last_posted_at')->useCurrent();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('solution_reply_id');
            $table->index(['is_pinned', 'last_posted_at']);
            $table->index('last_posted_at');
        });

        Schema::create('channel_thread', function (Blueprint $table): void {
            $table->foreignId('channel_id')->constrained()->cascadeOnDelete();
            $table->foreignId('thread_id')->constrained()->cascadeOnDelete();
            $table->primary(['channel_id', 'thread_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('channel_thread');
        Schema::dropIfExists('threads');
    }
};
