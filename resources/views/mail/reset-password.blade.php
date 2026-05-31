<x-mail.layout subject="Réinitialisation de votre mot de passe">
    <h1 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 600; color: #0c1412; line-height: 1.3;">
        Bonjour {{ $userName }},
    </h1>

    <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #2a3632;">
        Vous recevez cet email car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.
    </p>

    {{-- CTA button --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
        <tr>
            <td align="center">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{ $resetUrl }}" style="height:44px;v-text-anchor:middle;width:260px;" arcsize="18%" fillcolor="#0f7b4d" stroke="f">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:'Segoe UI',sans-serif;font-size:15px;font-weight:500;">Réinitialiser le mot de passe</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="{{ $resetUrl }}" target="_blank" style="display: inline-block; background-color: #0f7b4d; color: #ffffff; font-size: 15px; font-weight: 500; text-decoration: none; padding: 12px 28px; border-radius: 8px; line-height: 1.15;">Réinitialiser le mot de passe</a>
                <!--<![endif]-->
            </td>
        </tr>
    </table>

    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #52605a;">
        Ce lien expire dans {{ $expireMinutes }} minutes.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #52605a;">
        Si vous n'avez pas demandé de réinitialisation, aucune action n'est requise.
    </p>

    {{-- URL fallback --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td style="border-top: 1px solid #e4ece8; padding-top: 20px;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #8f9a95; word-break: break-all;">
                    Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur : {{ $resetUrl }}
                </p>
            </td>
        </tr>
    </table>
</x-mail.layout>
