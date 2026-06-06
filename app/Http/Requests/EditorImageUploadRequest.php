<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Override;

final class EditorImageUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'file',
                'image',
                'mimes:jpeg,jpg,png,webp,avif,gif',
                'max:5120',
                'dimensions:max_width=4000,max_height=4000',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    #[Override]
    public function messages(): array
    {
        return [
            'image.required' => 'Aucune image reçue.',
            'image.image' => 'Le fichier doit être une image.',
            'image.mimes' => 'Format non supporté. Utilise JPG, PNG, WebP, AVIF ou GIF.',
            'image.max' => 'Image trop lourde (5 Mo maximum).',
            'image.dimensions' => 'Dimensions trop grandes (4000×4000 px maximum).',
        ];
    }
}
