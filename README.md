<div align="center">

<img src="public/images/laravel-sn-logo.svg" alt="Laravel Sénégal" width="120" />

# Laravel Sénégal

Le portail de la communauté des développeurs PHP & Laravel au Sénégal.
On partage, on apprend, on construit — en français, depuis Dakar.

[![CI](https://github.com/laravel-sn/laravel.sn/actions/workflows/ci.yml/badge.svg)](https://github.com/laravel-sn/laravel.sn/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.4+-777BB4)](https://php.net)

[Site](https://laravel-senegal.com) · [Discord](https://discord.gg/laravel-sn) · [WhatsApp](https://chat.whatsapp.com/JwITxALLv0uJIGNu7AsVnx) · [Contribuer](.github/CONTRIBUTING.md)

</div>

---

## À propos

Ce dépôt contient le code source de [laravel-senegal.com](https://laravel-senegal.com), le portail de la communauté Laravel Sénégal. La plateforme rassemble plus de 500 développeurs autour d'articles techniques, de meetups réguliers, d'un podcast et de ressources en français.

Le projet est **open source** et entretenu par la communauté. Toute contribution est la bienvenue, qu'il s'agisse de code, de design, de documentation ou de signalement de bugs.

## Stack

- **Backend** : Laravel 13, PHP 8.3
- **Frontend** : Inertia.js 3, React 19, TypeScript
- **Styling** : Tailwind CSS v4, shadcn/ui
- **Base de données** : MySQL 8 (production), SQLite (dev)
- **Tests** : Pest 3
- **CI/CD** : GitHub Actions, Laravel Forge

## Pré-requis

- PHP 8.3+
- Composer 2.7+
- Node 22+ (LTS)
- npm 10+
- SQLite ou MySQL 8+

## Installation

Clone le dépôt :

```bash
git clone git@github.com:laravel-sn/laravel.sn.git
cd laravel.sn
```

Installe les dépendances :

```bash
composer install
npm install
```

Configure l'environnement :

```bash
cp .env.example .env
php artisan key:generate
```

Crée la base et les données de test :

```bash
touch database/database.sqlite
php artisan migrate --seed
```

Lance le serveur de développement :

```bash
npm run dev          # dans un terminal
php artisan serve    # dans un autre terminal
```

Ouvre [http://localhost:8000](http://localhost:8000).

Compte de test créé par le seeder :
- Email : `dev@laravel-sn.com`
- Mot de passe : `password`

## Tests

```bash
# Tous les tests
php artisan test

# En parallèle (plus rapide)
./vendor/bin/pest --parallel

# Avec coverage
./vendor/bin/pest --coverage

# Un fichier spécifique
./vendor/bin/pest tests/Feature/HomeTest.php
```

## Qualité du code

```bash
# Formatage PHP
./vendor/bin/pint

# Analyse statique PHP
./vendor/bin/phpstan analyse

# Lint TypeScript
npm run lint

# Type-check TypeScript
npm run typecheck

# Format JS/TS
npm run format

# Tout vérifier en une commande
npm run check
```

## Structure du projet

```
laravel.sn/
├── app/                       # Code applicatif Laravel
│   ├── Actions/               # Logique métier réutilisable
│   ├── Http/Controllers/      # Controllers Inertia
│   └── Models/                # Models Eloquent
├── resources/
│   ├── css/                   # Tailwind v4 + tokens
│   └── js/
│       ├── components/        # Composants React
│       │   └── ui/            # shadcn/ui customisés
│       ├── layouts/           # Layouts Inertia
│       └── pages/             # Pages Inertia
├── routes/
│   └── web.php                # Routes principales
└── tests/
    ├── Feature/               # Tests fonctionnels
    └── Unit/                  # Tests unitaires
```

## Contribuer

Les contributions sont chaleureusement accueillies. Avant de proposer une modification, lis [CONTRIBUTING.md](.github/CONTRIBUTING.md) et le [code de conduite](.github/CODE_OF_CONDUCT.md).

Pour signaler un bug ou proposer une fonctionnalité, ouvre une [issue](https://github.com/laravel-sn/laravel.sn/issues/new/choose).

Pour les questions générales, utilise plutôt les [Discussions](https://github.com/laravel-sn/laravel.sn/discussions) ou rejoins la [communauté WhatsApp](https://chat.whatsapp.com/JwITxALLv0uJIGNu7AsVnx).

## Sécurité

Si tu découvres une faille de sécurité, **ne crée pas d'issue publique**. Envoie un email à `security@laravel-sn.com`. Plus de détails dans [SECURITY.md](SECURITY.md).

## Sponsors

Merci aux entreprises qui soutiennent la communauté. Pour devenir sponsor, contacte `partenaires@laravel-sn.com` ou consulte [/sponsors](https://laravel-senegal.com/sponsors).

## Licence

[MIT](LICENSE) © 2021–2026 Laravel Sénégal et ses contributeurs.

---
