<x-mail.layout :subject="$subject">
    <h1 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 600; color: #0c1412; line-height: 1.3;">
        Bonjour {{ $userName }},
    </h1>

    <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #2a3632;">
        <strong>{{ $authorName }}</strong> a répondu à la discussion <strong>{{ $threadTitle }}</strong>.
    </p>

    {{-- Reply preview --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
        <tr>
            <td style="background-color: #f8fbf9; border: 1px solid #e4ece8; border-radius: 8px; padding: 16px 20px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #2a3632; font-style: italic;">{{ $preview }}</p>
            </td>
        </tr>
    </table>

    {{-- CTA button --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
        <tr>
            <td align="center">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{ $replyUrl }}" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="18%" fillcolor="#0f7b4d" stroke="f">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:'Segoe UI',sans-serif;font-size:15px;font-weight:500;">Voir la réponse</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="{{ $replyUrl }}" target="_blank" style="display: inline-block; background-color: #0f7b4d; color: #ffffff; font-size: 15px; font-weight: 500; text-decoration: none; padding: 12px 28px; border-radius: 8px; line-height: 1.15;">Voir la réponse</a>
                <!--<![endif]-->
            </td>
        </tr>
    </table>

    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #8f9a95;">
        Vous recevez cet email car vous êtes abonné à cette discussion.
    </p>
</x-mail.layout>
