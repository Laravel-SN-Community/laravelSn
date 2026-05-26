<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

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
