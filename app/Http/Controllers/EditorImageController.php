<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\EditorImageUploadRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class EditorImageController extends Controller
{
    public function store(EditorImageUploadRequest $request): JsonResponse
    {
        $file = $request->file('image');

        $source = imagecreatefromstring(file_get_contents($file->getRealPath()));

        if ($source === false) {
            return response()->json(['message' => 'Image illisible.'], 422);
        }

        $width = imagesx($source);
        $height = imagesy($source);

        if ($width > 2000) {
            $newHeight = (int) round($height * (2000 / $width));
            $resized = imagescale($source, 2000, $newHeight);
            imagedestroy($source);
            $source = $resized;
        }

        ob_start();
        imagewebp($source, null, 82);
        $encoded = ob_get_clean();
        imagedestroy($source);

        $path = sprintf(
            'editor/%s/%s.webp',
            now()->format('Y/m'),
            Str::ulid(),
        );

        Storage::disk($this->disk())->put($path, $encoded, [
            'visibility' => 'public',
            'ContentType' => 'image/webp',
            'CacheControl' => 'public, max-age=31536000, immutable',
        ]);

        return response()->json([
            'url' => Storage::disk($this->disk())->url($path),
        ]);
    }

    private function disk(): string
    {
        return (string) config('filesystems.editor_disk', config('filesystems.default'));
    }
}
