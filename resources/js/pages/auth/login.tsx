import { Form, Head, Link } from '@inertiajs/react';
import { Github } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

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

const inputStyle = {
    background: 'var(--sn-surface)',
    border: '1px solid var(--sn-border)',
    color: 'var(--sn-fg)',
} as const;

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Connexion" />

            {status && (
                <div
                    className="mb-5 rounded-md p-3 text-[12.5px]"
                    style={{
                        background:
                            'color-mix(in oklch, var(--sn-accent) 12%, transparent)',
                        color: 'var(--sn-accent)',
                    }}
                >
                    {status}
                </div>
            )}

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
                <a
                    href="/auth/github/redirect"
                    className="sn-btn sn-btn-secondary justify-center gap-2 text-[13px]"
                >
                    <Github size={14} /> GitHub
                </a>
                <a
                    href="/auth/google/redirect"
                    className="sn-btn sn-btn-secondary justify-center gap-2 text-[13px]"
                >
                    <GoogleIcon /> Google
                </a>
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
                <div
                    className="h-px flex-1"
                    style={{ background: 'var(--sn-border)' }}
                />
                <span
                    className="text-[11.5px]"
                    style={{ color: 'var(--sn-muted)' }}
                >
                    ou
                </span>
                <div
                    className="h-px flex-1"
                    style={{ background: 'var(--sn-border)' }}
                />
            </div>

            <Form action={store()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="flex flex-col gap-4">
                        {/* Email */}
                        <div className="grid gap-1.5">
                            <label
                                htmlFor="email"
                                className="text-[13px] font-medium"
                                style={{ color: 'var(--sn-fg)' }}
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="email"
                                placeholder="toi@example.com"
                                className="w-full rounded-md px-3 py-2.5 text-[14px] outline-none"
                                style={inputStyle}
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="grid gap-1.5">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-[13px] font-medium"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    Mot de passe
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={request()}
                                        className="text-[11.5px] hover:underline"
                                        style={{ color: 'var(--sn-muted)' }}
                                    >
                                        Oublié ?
                                    </Link>
                                )}
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="text-[14px]"
                                style={inputStyle}
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember me */}
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                name="remember"
                                id="remember"
                                className="h-4 w-4 rounded accent-[color:var(--sn-accent)]"
                            />
                            <span
                                className="text-[13px]"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                Se souvenir de moi
                            </span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="sn-btn sn-btn-primary mt-1 w-full justify-center"
                            data-test="login-button"
                        >
                            {processing ? 'Connexion…' : 'Se connecter'}
                        </button>

                        {/* Switch link */}
                        {canRegister && (
                            <p
                                className="mt-1 text-center text-[12px]"
                                style={{ color: 'var(--sn-muted)' }}
                            >
                                Pas encore membre ?{' '}
                                <Link
                                    href={register()}
                                    className="font-medium hover:underline"
                                    style={{ color: 'var(--sn-fg)' }}
                                >
                                    Rejoindre
                                </Link>
                            </p>
                        )}
                    </div>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Connexion',
    description: 'Heureux de te revoir dans la communauté.',
    eyebrow: 'retour parmi nous',
};
