<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $subject ?? config('app.name') }}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');

        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0; mso-table-rspace: 0; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }

        @media only screen and (max-width: 600px) {
            .sn-card-padding { padding: 28px 20px !important; }
            .sn-outer-padding { padding: 24px 12px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fbf9; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fbf9;">
        <tr>
            <td align="center" class="sn-outer-padding" style="padding: 40px 16px;">
                <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">
                    {{-- Logo --}}
                    <tr>
                        <td align="center" style="padding-bottom: 32px;">
                            <a href="{{ url('/') }}" style="text-decoration: none;">
                                <img src="{{ asset('images/logo.svg') }}" alt="Laravel Senegal" width="48" height="70" style="display: block; width: 48px; height: auto;">
                            </a>
                        </td>
                    </tr>

                    {{-- Card --}}
                    <tr>
                        <td style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e4ece8; box-shadow: 0 1px 2px rgba(12, 20, 18, 0.04);">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="sn-card-padding" style="padding: 40px 36px;">
                                        {{ $slot }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td align="center" style="padding: 28px 16px 0;">
                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #8f9a95;">
                                &copy; {{ date('Y') }} Laravel Senegal &mdash; La communauté Laravel au Sénégal
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
