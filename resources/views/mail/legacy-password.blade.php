<x-mail.layout :subject="$subject">
    <h1 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 600; color: #0c1412; line-height: 1.3;">
        Bonjour {{ $userName }},
    </h1>

    <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #2a3632;">
        Nous avons migré votre compte vers la nouvelle version de <strong>Laravel.sn</strong>.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #2a3632;">
        Votre ancien compte utilisait la connexion via <strong>{{ $provider }}</strong>, qui n'est plus disponible pour le moment. Un mot de passe temporaire a été généré pour vous :
    </p>

    {{-- Password box --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
        <tr>
            <td style="background-color: #f8fbf9; border: 1px solid #e4ece8; border-radius: 8px; padding: 16px 20px; text-align: center;">
                <span style="font-size: 20px; font-weight: 600; color: #0c1412; letter-spacing: 0.5px; font-family: 'Courier New', Courier, monospace;">{{ $plainPassword }}</span>
            </td>
        </tr>
    </table>

    {{-- CTA button --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
        <tr>
            <td align="center">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{ $loginUrl }}" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="18%" fillcolor="#0f7b4d" stroke="f">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:'Segoe UI',sans-serif;font-size:15px;font-weight:500;">Se connecter</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="{{ $loginUrl }}" target="_blank" style="display: inline-block; background-color: #0f7b4d; color: #ffffff; font-size: 15px; font-weight: 500; text-decoration: none; padding: 12px 28px; border-radius: 8px; line-height: 1.15;">Se connecter</a>
                <!--<![endif]-->
            </td>
        </tr>
    </table>

    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #52605a;">
        Nous vous recommandons de changer votre mot de passe dès votre première connexion depuis les paramètres de votre profil.
    </p>
</x-mail.layout>
