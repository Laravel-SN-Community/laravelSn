import { Monitor, Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';

export default function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();

    const options: [Appearance, typeof Sun, string][] = [
        ['light', Sun, 'Clair'],
        ['system', Monitor, 'Système'],
        ['dark', Moon, 'Sombre'],
    ];

    return (
        <div
            role="radiogroup"
            aria-label="Thème"
            className="inline-flex rounded-md p-0.5"
            style={{
                background: 'var(--sn-surface-2)',
                border: '1px solid var(--sn-border)',
            }}
        >
            {options.map(([key, Icon, label]) => (
                <button
                    key={key}
                    role="radio"
                    aria-checked={appearance === key}
                    aria-label={label}
                    onClick={() => updateAppearance(key)}
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-[5px] transition-colors"
                    style={
                        appearance === key
                            ? {
                                  background: 'var(--sn-surface)',
                                  color: 'var(--sn-fg)',
                                  boxShadow: 'var(--sn-shadow-xs)',
                              }
                            : { color: 'var(--sn-muted)' }
                    }
                >
                    <Icon size={13} />
                </button>
            ))}
        </div>
    );
}
