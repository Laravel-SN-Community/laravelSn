import { Head, Link } from '@inertiajs/react';
import { Github } from 'lucide-react';
// import { Form } from '@inertiajs/react';
// import InputError from '@/components/input-error';
// import PasswordInput from '@/components/password-input';
// import { store } from '@/routes/register';
import { login } from '@/routes';

function GoogleIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

export default function Register() {
    return (
        <>
            <Head title="Inscription" />

            <div className="flex flex-col gap-3">
                <a
                    href="/auth/github/redirect"
                    className="sn-btn sn-btn-secondary w-full justify-center gap-2.5 py-3 text-[13.5px]"
                >
                    <Github size={15} />
                    S'inscrire avec GitHub
                </a>
                <a
                    href="/auth/google/redirect"
                    className="sn-btn sn-btn-secondary w-full justify-center gap-2.5 py-3 text-[13.5px]"
                >
                    <GoogleIcon />
                    S'inscrire avec Google
                </a>
            </div>

            {/* Registration form (temporarily hidden) */}
            {/*
            <Form action={store()} resetOnSuccess={['password', 'password_confirmation']} disableWhileProcessing>
                {({ processing, errors }) => (
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-1.5">
                            <label htmlFor="name" className="text-[13px] font-medium" style={{ color: 'var(--sn-fg)' }}>Nom complet</label>
                            <input id="name" type="text" name="name" required autoFocus autoComplete="name" placeholder="Aminata Diallo" className="w-full rounded-md px-3 py-2.5 text-[14px] outline-none" style={inputStyle} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-1.5">
                            <label htmlFor="username" className="text-[13px] font-medium" style={{ color: 'var(--sn-fg)' }}>Nom d'utilisateur</label>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[13px]" style={{ color: 'var(--sn-muted)' }}>@</span>
                                <input id="username" type="text" name="username" required autoComplete="username" placeholder="aminata_dev" className="w-full rounded-md py-2.5 pr-3 pl-7 text-[14px] outline-none" style={inputStyle} />
                            </div>
                            <InputError message={errors.username} />
                        </div>
                        <div className="grid gap-1.5">
                            <label htmlFor="email" className="text-[13px] font-medium" style={{ color: 'var(--sn-fg)' }}>Email</label>
                            <input id="email" type="email" name="email" required autoComplete="email" placeholder="toi@example.com" className="w-full rounded-md px-3 py-2.5 text-[14px] outline-none" style={inputStyle} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-1.5">
                            <label htmlFor="password" className="text-[13px] font-medium" style={{ color: 'var(--sn-fg)' }}>Mot de passe</label>
                            <PasswordInput id="password" name="password" required autoComplete="new-password" placeholder="••••••••" className="text-[14px]" style={inputStyle} />
                            <InputError message={errors.password} />
                        </div>
                        <div className="grid gap-1.5">
                            <label htmlFor="password_confirmation" className="text-[13px] font-medium" style={{ color: 'var(--sn-fg)' }}>Confirmer le mot de passe</label>
                            <PasswordInput id="password_confirmation" name="password_confirmation" required autoComplete="new-password" placeholder="••••••••" className="text-[14px]" style={inputStyle} />
                            <InputError message={errors.password_confirmation} />
                        </div>
                        <button type="submit" disabled={processing} className="sn-btn sn-btn-primary mt-1 w-full justify-center" data-test="register-user-button">
                            {processing ? 'Création…' : 'Créer mon compte'}
                        </button>
                    </div>
                )}
            </Form>
            */}

            <p
                className="mt-4 text-center text-[12px]"
                style={{ color: 'var(--sn-muted)' }}
            >
                Déjà membre ?{' '}
                <Link
                    href={login()}
                    className="font-medium hover:underline"
                    style={{ color: 'var(--sn-fg)' }}
                >
                    Se connecter
                </Link>
            </p>
        </>
    );
}

Register.layout = {
    title: 'Créer un compte',
    description: 'Rejoins la communauté des développeurs Laravel au Sénégal.',
    eyebrow: 'nouveau compte',
};
