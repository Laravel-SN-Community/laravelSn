<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @php
            $defaultDescription = 'Laravel Sénégal — la communauté francophone des développeurs Laravel au Sénégal. Articles, forum, événements et opportunités.';
            $resolvedDescription = $description ?? $defaultDescription;
            $resolvedOgTitle = $ogTitle ?? config('app.name', 'Laravel Sénégal');
            $resolvedOgType = $ogType ?? 'website';
        @endphp

        <meta name="description" content="{{ $resolvedDescription }}">
        <meta property="og:site_name" content="{{ config('app.name', 'Laravel Sénégal') }}">
        <meta property="og:title" content="{{ $resolvedOgTitle }}">
        <meta property="og:description" content="{{ $resolvedDescription }}">
        <meta property="og:type" content="{{ $resolvedOgType }}">
        <meta property="og:url" content="{{ url()->current() }}">
        @if (! empty($ogImage))
            <meta property="og:image" content="{{ $ogImage }}">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:image" content="{{ $ogImage }}">
        @else
            <meta name="twitter:card" content="summary">
        @endif
        <meta name="twitter:title" content="{{ $resolvedOgTitle }}">
        <meta name="twitter:description" content="{{ $resolvedDescription }}">

        {{-- Inline script to detect theme preference and apply it before any paint --}}
        <script>
            (function() {
                const serverAppearance = '{{ $appearance ?? "system" }}';
                const syncFromServer = {{ ($syncAppearanceFromServer ?? false) ? 'true' : 'false' }};
                let appearance;
                if (syncFromServer) {
                    // Logged-in user has a DB preference — it wins, sync localStorage
                    appearance = serverAppearance;
                    try {
                        localStorage.setItem('appearance', appearance);
                        document.cookie = 'appearance=' + appearance + ';path=/;max-age=' + (365 * 24 * 60 * 60) + ';SameSite=Lax';
                    } catch (e) {}
                } else {
                    // Guest or no DB preference — localStorage wins
                    appearance = localStorage.getItem('appearance') || serverAppearance;
                }
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark);
                document.documentElement.classList.toggle('dark', isDark);
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: #f8fbf9;
            }

            html.dark {
                background-color: #0c1412;
            }
        </style>

        <link rel="icon" href="/favicons/favicon.ico" sizes="any">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png">
        <link rel="manifest" href="/favicons/site.webmanifest">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

        @if (! empty($lcpImage['sm']) || ! empty($lcpImage['md']))
            @php
                $lcpSrcset = collect([
                    ! empty($lcpImage['sm']) ? $lcpImage['sm'].' 640w' : null,
                    ! empty($lcpImage['md']) ? $lcpImage['md'].' 1280w' : null,
                ])->filter()->implode(', ');
            @endphp
            <link rel="preload" as="image" href="{{ $lcpImage['md'] ?? $lcpImage['sm'] }}" imagesrcset="{{ $lcpSrcset }}" imagesizes="(min-width: 1024px) 760px, (max-width: 639px) 100vw, 100vw" fetchpriority="high">
        @endif

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
