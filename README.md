<div align="center">

<img src="public/images/logo.svg" alt="Laravel Sénégal" width="120" />

# Laravel Sénégal

Le portail de la communauté des développeurs PHP & Laravel au Sénégal.

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.5+-777BB4)](https://php.net)

[Site](https://laravel-senegal.com) · [WhatsApp](https://chat.whatsapp.com/JwITxALLv0uJIGNu7AsVnx) · [Contribuer](.github/CONTRIBUTING.md)

</div>

---

## À propos

Ce dépôt contient le code source de [laravel-senegal.com](https://laravel-senegal.com), le portail de la communauté Laravel Sénégal.

Le projet est **open source** et entretenu par la communauté. Toute contribution est la bienvenue, qu'il s'agisse de code, de design, de documentation ou de signalement de bugs.

## Stack

- **Backend** : Laravel 13, PHP 8.5
- **Frontend** : Inertia.js 3, React 19, TypeScript
- **Styling** : Tailwind CSS v4, shadcn/ui
- **Base de données** : PostgreSQL 17 (production), SQLite (tests)
- **Cache / Files** : Redis 7
- **Recherche** : Typesense 26
- **Tests** : Pest 4
- **CI/CD** : GitHub Actions, Laravel Forge

## Pré-requis

- **Docker** (c'est tout)

## Installation

```bash
git clone git@github.com:Laravel-SN-Community/laravel.sn.git
cd laravel.sn
make up
```

Lance le serveur de développement :

```bash
make dev
```

Ouvre [http://localhost:8000](http://localhost:8000).

Compte de test créé par le seeder :
- Email : `admin@laravel.sn`
- Mot de passe : `password`

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `make up` | Premier démarrage — build, install, migrate:fresh, seed, index Scout |
| `make dev` | Lance le serveur de dev (Laravel + Vite + queue + logs) |
| `make down` | Arrête tous les conteneurs |
| `make fresh` | Réinitialise la base de données et re-indexe Scout |
| `make test` | Lance la suite CI complète (pint, phpstan, rector, eslint, prettier, tsc, tests) |
| `make shell` | Ouvre un terminal dans le conteneur |
| `make artisan cmd="..."` | Exemple : `make artisan cmd="migrate"` |
| `make composer cmd="..."` | Exemple : `make composer cmd="require pkg/name"` |
| `make npm cmd="..."` | Exemple : `make npm cmd="run build"` |

## Tests et qualité du code

```bash
# Suite CI complète (pint, phpstan, rector, eslint, prettier, tsc, tests)
make test

# Un test spécifique
make artisan cmd="test --compact --filter=NomDuTest"
```

Pour lancer les outils individuellement depuis le conteneur :

```bash
make shell

./vendor/bin/pint               # Formatage PHP
./vendor/bin/phpstan analyse    # Analyse statique
./vendor/bin/rector process     # Refactoring automatique
npm run lint                    # Lint TypeScript
npm run types:check             # Type-check TypeScript
```

## Structure du projet

```
laravel.sn/
├── app/                       # Code applicatif Laravel
│   ├── Actions/               # Logique métier réutilisable
│   ├── Concerns/              # Traits partagés
│   ├── Enums/                 # Enums PHP 8
│   ├── Http/
│   │   ├── Controllers/       # Controllers Inertia
│   │   ├── Middleware/
│   │   └── Requests/          # Form requests
│   ├── Models/                # Models Eloquent
│   ├── Policies/              # Policies d'autorisation
│   ├── Providers/
│   └── Support/               # Classes utilitaires
├── resources/
│   ├── css/                   # Tailwind v4 + tokens
│   └── js/
│       ├── actions/           # Wayfinder (généré)
│       ├── components/        # Composants React
│       │   ├── site/          # Composants métier
│       │   └── ui/            # shadcn/ui customisés
│       ├── hooks/             # React hooks
│       ├── layouts/           # Layouts Inertia
│       ├── lib/               # Utilitaires JS
│       ├── pages/             # Pages Inertia
│       ├── routes/            # Wayfinder routes (généré)
│       ├── types/             # Types TypeScript
│       └── wayfinder/         # Config Wayfinder
├── routes/
│   ├── web.php                # Routes principales
│   └── settings.php           # Routes paramètres
└── tests/
    ├── Feature/               # Tests fonctionnels
    └── Unit/                  # Tests unitaires
```

## Contribuer

Les contributions sont chaleureusement accueillies. Avant de proposer une modification, lis [CONTRIBUTING.md](.github/CONTRIBUTING.md) et le [code de conduite](.github/CODE_OF_CONDUCT.md).

Pour signaler un bug ou proposer une fonctionnalité, ouvre une [issue](https://github.com/Laravel-SN-Community/laravel.sn/issues/new/choose).

Pour les questions générales, rejoins la [communauté WhatsApp](https://chat.whatsapp.com/JwITxALLv0uJIGNu7AsVnx).

## Sécurité

Si tu découvres une faille de sécurité, **ne crée pas d'issue publique**. Envoie un email à `security@laravel.sn`. Plus de détails dans [SECURITY.md](SECURITY.md).

## Sponsors

Merci aux entreprises qui soutiennent la communauté. Pour devenir sponsor, contacte `partenaires@laravel.sn` ou consulte [/sponsors](https://laravel-senegal.com/sponsors).

## Licence

[MIT](LICENSE) © 2021–2026 Laravel Sénégal et ses contributeurs.

---
