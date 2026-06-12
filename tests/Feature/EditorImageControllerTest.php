<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('editor uploads are stored as webp on the configured editor disk', function (): void {
    Storage::fake('s3');
    config(['filesystems.editor_disk' => 's3']);

    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('editor.images.store'), [
        'image' => UploadedFile::fake()->image('photo.jpg', 1200, 800),
    ]);

    $response->assertOk();
    $response->assertJsonStructure(['url']);

    $files = Storage::disk('s3')->allFiles('editor');

    expect($files)->toHaveCount(1);
    expect($files[0])->toStartWith('editor/'.now()->format('Y/m').'/');
    expect($files[0])->toEndWith('.webp');
    expect($response->json('url'))->toContain($files[0]);
});

test('oversized images are resized to a maximum width of 2000 pixels', function (): void {
    Storage::fake('s3');
    config(['filesystems.editor_disk' => 's3']);

    $user = User::factory()->create();

    $this->actingAs($user)->post(route('editor.images.store'), [
        'image' => UploadedFile::fake()->image('photo.jpg', 3000, 1500),
    ])->assertOk();

    $files = Storage::disk('s3')->allFiles('editor');
    [$width, $height] = getimagesizefromstring(Storage::disk('s3')->get($files[0]));

    expect($width)->toBe(2000);
    expect($height)->toBe(1000);
});

test('guests cannot upload editor images', function (): void {
    $this->post(route('editor.images.store'), [
        'image' => UploadedFile::fake()->image('photo.jpg'),
    ])->assertRedirect(route('login'));
});
