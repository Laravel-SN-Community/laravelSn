export interface Article {
    slug: string;
    tag: string;
    title: string;
    excerpt: string;
    author: string;
    authorSlug: string;
    date: string;
    dateISO: string;
    readMinutes: number;
    tint: string;
}

export interface AgendaItem {
    t: string;
    label: string;
    detail: string;
}

export interface Event {
    slug: string;
    day: string;
    month: string;
    year: string;
    dateISO: string;
    title: string;
    where: string;
    city: string;
    time: string;
    seats: number;
    total: number;
    status: string;
    featured: boolean;
    description: string;
    type: string;
    price: string;
    agenda: AgendaItem[];
    speakers: string[];
}

export interface Resource {
    slug: string;
    type: string;
    title: string;
    desc: string;
    meta: string;
    level: string;
    author: string;
    date: string;
}

export interface Member {
    slug: string;
    name: string;
    role: string;
    company: string;
    city: string;
    init: string;
    tint: string;
    tags: string[];
    articles: number;
    events: number;
    bio: string;
    github: string;
    site: string;
}

export interface ForumThread {
    slug: string;
    tags: string[];
    title: string;
    excerpt: string;
    author: string;
    authorSlug: string;
    when: string;
    replies: number;
    views: number;
    resolved: boolean;
}

export const ARTICLES: Article[] = [
    {
        slug: 'n-plus-1',
        tag: 'Eloquent',
        title: 'Modèles sans N+1 : patterns éprouvés',
        excerpt:
            "Trois façons concrètes d'éviter les requêtes cachées, avec des exemples tirés d'apps en production.",
        author: 'Aïssatou Diop',
        authorSlug: 'aissatou-diop',
        date: '12 avr. 2026',
        dateISO: '2026-04-12',
        readMinutes: 6,
        tint: 'var(--sn-700)',
    },
    {
        slug: 'horizon',
        tag: 'Horizon',
        title: 'Queues & Horizon en production',
        excerpt:
            "Monitorer, scaler, relancer. Le guide pratique pour passer son application Laravel à l'asynchrone.",
        author: 'Omar Sy',
        authorSlug: 'omar-sy',
        date: '04 avr. 2026',
        dateISO: '2026-04-04',
        readMinutes: 9,
        tint: 'var(--sn-600)',
    },
    {
        slug: 'inertia-v3',
        tag: 'Inertia',
        title: 'Inertia v3 : les nouveautés',
        excerpt:
            "Polling, prefetch, deferred props — le panorama des nouvelles primitives qu'on utilise déjà au quotidien.",
        author: 'Mamadou F.',
        authorSlug: 'mamadou-f',
        date: '28 mars 2026',
        dateISO: '2026-03-28',
        readMinutes: 5,
        tint: 'var(--sn-500)',
    },
    {
        slug: 'pest-ci',
        tag: 'Tests',
        title: 'Pest 4 + GitHub Actions : pipeline complet',
        excerpt:
            'Notre setup CI complet : parallèle, couverture, cache composer et node, avec assertion fine sur Pest.',
        author: 'Khady Ndiaye',
        authorSlug: 'khady-ndiaye',
        date: '20 mars 2026',
        dateISO: '2026-03-20',
        readMinutes: 11,
        tint: 'var(--sn-700)',
    },
    {
        slug: 'filament-v4',
        tag: 'Filament',
        title: "Filament v4 : retours d'expérience",
        excerpt:
            "Ce qui a changé, ce qui est vraiment mieux, et quelques pièges qu'on a rencontrés sur 3 refontes.",
        author: 'Ibrahima Ba',
        authorSlug: 'ibrahima-ba',
        date: '12 mars 2026',
        dateISO: '2026-03-12',
        readMinutes: 7,
        tint: 'var(--sn-600)',
    },
    {
        slug: 'mobile-money',
        tag: 'SDK',
        title: 'Intégrer Wave, Orange Money & Free Money',
        excerpt:
            'Un seul SDK, trois providers, des webhooks signés. Retour sur la conception de laravel-mobile-money.',
        author: 'Fatou Sow',
        authorSlug: 'fatou-sow',
        date: '01 mars 2026',
        dateISO: '2026-03-01',
        readMinutes: 8,
        tint: 'var(--sn-500)',
    },
    {
        slug: 'livewire-v3',
        tag: 'Livewire',
        title: 'Livewire 3 : migrer sans casser',
        excerpt:
            "Notre retour sur la migration d'une app de production de Livewire 2 à 3 sans régression majeure.",
        author: 'Abdoulaye Ba',
        authorSlug: 'abdoulaye-ba',
        date: '22 fév. 2026',
        dateISO: '2026-02-22',
        readMinutes: 10,
        tint: 'var(--sn-700)',
    },
    {
        slug: 'rate-limit',
        tag: 'API',
        title: 'Rate limiting avancé avec Laravel 13',
        excerpt:
            'Au-delà du throttle:60,1 — par plan tarifaire, par IP, par région, avec Redis et des buckets flexibles.',
        author: 'Ndeye Diouf',
        authorSlug: 'ndeye-diouf',
        date: '14 fév. 2026',
        dateISO: '2026-02-14',
        readMinutes: 6,
        tint: 'var(--sn-600)',
    },
    {
        slug: 'queue-resilience',
        tag: 'Queues',
        title: 'Queues résilientes aux coupures réseau',
        excerpt:
            "Comment on a bâti ndank-queue : un driver qui persiste localement quand MySQL n'est plus joignable.",
        author: 'Cheikh Kane',
        authorSlug: 'cheikh-kane',
        date: '05 fév. 2026',
        dateISO: '2026-02-05',
        readMinutes: 9,
        tint: 'var(--sn-500)',
    },
    {
        slug: 'blade-patterns',
        tag: 'Blade',
        title: "Patterns Blade qu'on sous-utilise",
        excerpt:
            "Directives personnalisées, slots nommés, @props : le Blade moderne est plus puissant qu'il n'y paraît.",
        author: 'Aïssatou Diop',
        authorSlug: 'aissatou-diop',
        date: '25 jan. 2026',
        dateISO: '2026-01-25',
        readMinutes: 5,
        tint: 'var(--sn-700)',
    },
    {
        slug: 'tinker-prod',
        tag: 'Ops',
        title: 'Tinker en production : oui, avec précaution',
        excerpt:
            "Quand c'est acceptable, quand ce ne l'est pas. Et comment auditer tout ce qui passe dans un shell.",
        author: 'Omar Sy',
        authorSlug: 'omar-sy',
        date: '15 jan. 2026',
        dateISO: '2026-01-15',
        readMinutes: 7,
        tint: 'var(--sn-600)',
    },
    {
        slug: 'search-meili',
        tag: 'Search',
        title: 'Meilisearch + Scout : recherche française propre',
        excerpt:
            'Accents, mots-clés en wolof, synonymes locaux — paramétrer Meili pour un contexte francophone ouest-africain.',
        author: 'Mamadou F.',
        authorSlug: 'mamadou-f',
        date: '08 jan. 2026',
        dateISO: '2026-01-08',
        readMinutes: 6,
        tint: 'var(--sn-500)',
    },
];

export const ALL_TAGS = [
    'Tous',
    'Eloquent',
    'Horizon',
    'Inertia',
    'Tests',
    'Filament',
    'SDK',
    'Livewire',
    'API',
    'Queues',
    'Blade',
    'Ops',
    'Search',
];

export const EVENTS: Event[] = [
    {
        slug: 'meetup-09',
        day: '18',
        month: 'MAI',
        year: '2026',
        dateISO: '2026-05-18T18:30',
        title: 'Meetup Dakar #09 — Filament & admin panels',
        where: 'CTIC Dakar · Plateau',
        city: 'Dakar',
        time: '18:30',
        seats: 42,
        total: 80,
        status: 'ouvert',
        featured: true,
        description:
            "Soirée meetup dédiée à Filament v4 : retour d'expérience sur des admin panels en production, démos live, Q&A.",
        type: 'meetup',
        price: 'Gratuit',
        agenda: [
            {
                t: '18:30',
                label: 'Accueil & réseautage',
                detail: 'Café, thé, jus de bissap',
            },
            {
                t: '19:00',
                label: 'Talk 1 — Filament v4 en production',
                detail: 'Ibrahima Ba · 25 min',
            },
            {
                t: '19:30',
                label: 'Talk 2 — Custom pages & widgets',
                detail: 'Khady Ndiaye · 20 min',
            },
            { t: '20:00', label: 'Panel + Q&A', detail: '15 min' },
            {
                t: '20:15',
                label: 'Cocktail & réseautage',
                detail: "jusqu'à 21:30",
            },
        ],
        speakers: ['ibrahima-ba', 'khady-ndiaye'],
    },
    {
        slug: 'pest-workshop',
        day: '06',
        month: 'JUIN',
        year: '2026',
        dateISO: '2026-06-06T10:00',
        title: 'Workshop : tests Pest + CI GitHub Actions',
        where: 'Baobab Center · Mermoz',
        city: 'Dakar',
        time: '10:00',
        seats: 24,
        total: 30,
        status: 'ouvert',
        featured: false,
        description:
            'Workshop pratique de 4h : on écrit ensemble une suite de tests Pest complète + un pipeline CI GitHub Actions prêt pour la prod.',
        type: 'workshop',
        price: '15 000 FCFA',
        agenda: [
            {
                t: '10:00',
                label: 'Pest basics & setup',
                detail: 'installation, structure',
            },
            {
                t: '11:00',
                label: 'Factories, datasets, mocking',
                detail: 'exercices pratiques',
            },
            { t: '12:30', label: 'Pause déjeuner', detail: 'offert' },
            {
                t: '13:30',
                label: 'CI GitHub Actions',
                detail: 'matrice, cache, artifacts',
            },
            {
                t: '14:30',
                label: 'Atelier libre',
                detail: 'tu ramènes ton projet',
            },
        ],
        speakers: ['omar-sy'],
    },
    {
        slug: 'laracon-sn',
        day: '20',
        month: 'JUIN',
        year: '2026',
        dateISO: '2026-06-20T09:00',
        title: 'Laracon Sénégal 2026 — conférence annuelle',
        where: 'King Fahd Palace · Almadies',
        city: 'Dakar',
        time: '09:00',
        seats: 210,
        total: 300,
        status: 'early bird',
        featured: true,
        description:
            'Notre conférence annuelle. Une journée entière, 12 talks, 3 workshops, 300 personnes. Au King Fahd Palace.',
        type: 'conférence',
        price: '25 000 FCFA (early)',
        agenda: [
            {
                t: '09:00',
                label: 'Ouverture',
                detail: "mot d'accueil + keynote",
            },
            {
                t: '10:00',
                label: 'Talks — track 1 & 2',
                detail: 'en parallèle, 6 sessions',
            },
            { t: '12:30', label: 'Déjeuner', detail: 'offert' },
            {
                t: '14:00',
                label: 'Workshops au choix',
                detail: 'Filament / Tests / Queues',
            },
            {
                t: '17:00',
                label: 'Talk de clôture',
                detail: 'invité surprise 🤫',
            },
            { t: '18:00', label: 'Afterparty', detail: 'cocktail + DJ set' },
        ],
        speakers: ['fatou-sow', 'abdoulaye-ba', 'omar-sy', 'ibrahima-ba'],
    },
    {
        slug: 'code-review',
        day: '10',
        month: 'JUIL',
        year: '2026',
        dateISO: '2026-07-10T19:00',
        title: 'Soirée code review — open floor',
        where: 'ODC Sénégal · Sacré-Cœur',
        city: 'Dakar',
        time: '19:00',
        seats: 12,
        total: 20,
        status: 'ouvert',
        featured: false,
        description:
            'Apporte un bout de code qui te tracasse, on le review ensemble. Bienveillance obligatoire.',
        type: 'meetup',
        price: 'Gratuit',
        agenda: [
            { t: '19:00', label: 'Accueil', detail: '' },
            { t: '19:15', label: 'Code reviews', detail: '5×15 min' },
            { t: '20:45', label: 'Discussion libre', detail: '' },
        ],
        speakers: [],
    },
    {
        slug: 'laravel-saint-louis',
        day: '25',
        month: 'JUIL',
        year: '2026',
        dateISO: '2026-07-25T18:00',
        title: 'Meetup Saint-Louis #01 — première édition',
        where: 'UGB · Campus',
        city: 'Saint-Louis',
        time: '18:00',
        seats: 18,
        total: 60,
        status: 'nouveau',
        featured: false,
        description:
            'On étend les meetups au-delà de Dakar. Première édition à Saint-Louis avec 3 speakers locaux.',
        type: 'meetup',
        price: 'Gratuit',
        agenda: [
            { t: '18:00', label: 'Accueil', detail: '' },
            { t: '18:30', label: '3 talks éclair', detail: '' },
            { t: '19:30', label: 'Cocktail', detail: '' },
        ],
        speakers: ['cheikh-kane'],
    },
];

export const MEMBERS: Member[] = [
    {
        slug: 'aissatou-diop',
        name: 'Aïssatou Diop',
        role: 'Full-stack dev',
        company: 'Wave',
        city: 'Dakar',
        init: 'AD',
        tint: '#0f7b4d',
        tags: ['Laravel', 'Eloquent', 'Vue'],
        articles: 2,
        events: 4,
        bio: "Développeuse full-stack chez Wave, 6 ans d'expérience Laravel. J'écris sur Eloquent et les patterns de testing.",
        github: 'aissatoudiop',
        site: 'aissatou.dev',
    },
    {
        slug: 'omar-sy',
        name: 'Omar Sy',
        role: 'DevOps / Tech Lead',
        company: 'Freelance',
        city: 'Dakar',
        init: 'OS',
        tint: '#188a5c',
        tags: ['DevOps', 'Queues', 'Redis'],
        articles: 3,
        events: 5,
        bio: "Tech lead freelance, j'aide des équipes à passer à l'échelle. Spécialisé infra et queues.",
        github: 'omarsy',
        site: 'omarsy.io',
    },
    {
        slug: 'mamadou-f',
        name: 'Mamadou Fall',
        role: 'Front-end / Inertia',
        company: 'Paps',
        city: 'Dakar',
        init: 'MF',
        tint: '#0b6640',
        tags: ['Inertia', 'Vue', 'Tailwind'],
        articles: 2,
        events: 3,
        bio: "Front-end chez Paps, grande histoire d'amour avec Inertia.js et Tailwind.",
        github: 'mamadoufall',
        site: 'mamadou.sn',
    },
    {
        slug: 'khady-ndiaye',
        name: 'Khady Ndiaye',
        role: 'Back-end dev',
        company: 'Baamtu',
        city: 'Dakar',
        init: 'KN',
        tint: '#3ea777',
        tags: ['Laravel', 'Pest', 'PHP'],
        articles: 1,
        events: 6,
        bio: 'Obsédée par les tests. Co-organise le Laravel Dakar Meetup.',
        github: 'khadyndiaye',
        site: '',
    },
    {
        slug: 'ibrahima-ba',
        name: 'Ibrahima Ba',
        role: 'CTO',
        company: 'Senjob',
        city: 'Dakar',
        init: 'IB',
        tint: '#0f7b4d',
        tags: ['Filament', 'Architecture', 'Leadership'],
        articles: 1,
        events: 7,
        bio: "CTO de Senjob, j'ai mis Filament dans 4 apps depuis v2.",
        github: 'ibrahimaba',
        site: '',
    },
    {
        slug: 'fatou-sow',
        name: 'Fatou Sow',
        role: 'Lead Engineer',
        company: 'Wave',
        city: 'Dakar',
        init: 'FS',
        tint: '#188a5c',
        tags: ['Laravel', 'Scale', 'Ops'],
        articles: 1,
        events: 3,
        bio: "Lead Eng chez Wave. J'ai parlé scaling Laravel à Laracon Online 2024.",
        github: 'fatousow',
        site: 'fatou.dev',
    },
    {
        slug: 'abdoulaye-ba',
        name: 'Abdoulaye Ba',
        role: 'CTO',
        company: 'Paps',
        city: 'Dakar',
        init: 'AB',
        tint: '#0b6640',
        tags: ['Laravel', 'Livewire', 'Startup'],
        articles: 1,
        events: 4,
        bio: 'CTO Paps. Passé du monolithe Blade au Livewire pur.',
        github: 'abdoulayeba',
        site: '',
    },
    {
        slug: 'cheikh-kane',
        name: 'Cheikh Kane',
        role: 'Infra engineer',
        company: 'Orange',
        city: 'Saint-Louis',
        init: 'CK',
        tint: '#0f7b4d',
        tags: ['Infra', 'Queues', 'PHP'],
        articles: 1,
        events: 1,
        bio: 'Infra chez Orange. Mainteneur de ndank-queue.',
        github: 'cheikhkane',
        site: '',
    },
    {
        slug: 'ndeye-diouf',
        name: 'Ndeye Diouf',
        role: 'Freelance',
        company: '—',
        city: 'Thiès',
        init: 'ND',
        tint: '#3ea777',
        tags: ['API', 'Laravel', 'Consulting'],
        articles: 1,
        events: 2,
        bio: "Freelance depuis 4 ans. J'interviens sur des audits de perf et de sécurité.",
        github: 'ndeyediouf',
        site: 'ndeye.dev',
    },
];

export const FORUM_THREADS: ForumThread[] = [
    {
        slug: 'deploy-infinity-free',
        tags: ['devops', 'laravel'],
        title: 'Comment déployer un projet Laravel avec InfinityFree',
        excerpt:
            "Voici le message qu'on renvoie : 403 Interdit. Comprendre l'Accès Refusé : une raison courante pour une erreur \"403 Interdit\" est lorsque vous accédez à un répertoire sur un serveur web sans spécifier un fichier d'index…",
        author: 'mkal',
        authorSlug: 'maimouna-sarr',
        when: 'il y a 2 semaines',
        replies: 1,
        views: 33,
        resolved: false,
    },
    {
        slug: 'api-orange-mtn',
        tags: ['laravel', 'api'],
        title: "Recherche d'information sur des API (Orange, MTN et récupération des quartiers)",
        excerpt:
            "Bonjour à tous. Je suis en train de travailler sur un projet et j'ai besoin d'informations : 1. Comment obtenir les API de confirmation des numéros Orange et MTN ? 2. Comment obtenir des API pour les quartiers de Dakar…",
        author: 'vnyay1',
        authorSlug: 'pape-diop',
        when: 'il y a 1 mois',
        replies: 3,
        views: 117,
        resolved: true,
    },
    {
        slug: 'ployer-site-laravel',
        tags: ['divers'],
        title: 'Comment déployer un site web développé avec Laravel ?',
        excerpt:
            "Bonjour, j'ai développé un site web e-commerce et je rencontre des difficultés pour le mettre en ligne. Quelqu'un peut-il m'aider, ou me dire comment procéder ? Mon hébergeur actuel : www.alwaysdata.com…",
        author: 'mathurincamer',
        authorSlug: 'cheikh-kane',
        when: 'il y a 4 mois',
        replies: 1,
        views: 181,
        resolved: false,
    },
    {
        slug: 'pest-vs-phpunit',
        tags: ['tests', 'pest'],
        title: 'Pest vs PHPUnit en 2026 : que choisir pour un nouveau projet ?',
        excerpt:
            "On démarre un gros projet Laravel 11 et l'équipe hésite. Pest semble plus moderne mais PHPUnit reste la référence. Vos retours d'expérience ? Surtout sur la maintenance long terme…",
        author: 'khady',
        authorSlug: 'khady-ndiaye',
        when: 'il y a 3 jours',
        replies: 8,
        views: 94,
        resolved: true,
    },
    {
        slug: 'queue-redis-prod',
        tags: ['devops', 'laravel'],
        title: 'Configuration Redis + Horizon en production : retours ?',
        excerpt:
            "Je migre nos jobs de la base de données vers Redis avec Horizon. Quelqu'un a un retour sur la conf optimale pour ~10k jobs/jour ? Memory limits, supervisor, monitoring…",
        author: 'omarsy',
        authorSlug: 'omar-sy',
        when: 'il y a 1 semaine',
        replies: 5,
        views: 201,
        resolved: false,
    },
    {
        slug: 'inertia-shared-props',
        tags: ['inertia', 'vue'],
        title: 'Inertia.js — partager des props globales sans tout recharger',
        excerpt:
            "Avec Inertia v3, comment partager efficacement le user connecté + les notifications sans refaire un appel à chaque navigation ? J'utilise lazy props mais c'est peut-être pas optimal…",
        author: 'mfall',
        authorSlug: 'mamadou-f',
        when: 'il y a 5 jours',
        replies: 4,
        views: 67,
        resolved: false,
    },
    {
        slug: 'eloquent-soft-delete',
        tags: ['eloquent', 'laravel'],
        title: 'SoftDeletes + relations : comment éviter les références cassées ?',
        excerpt:
            "J'ai un Order avec des items. Si je soft-delete une commande, ses items restent. Comment gérer ça proprement ? Cascade soft delete ? Restoring observer ?",
        author: 'aissatoud',
        authorSlug: 'aissatou-diop',
        when: 'il y a 2 jours',
        replies: 2,
        views: 48,
        resolved: false,
    },
    {
        slug: 'collab-cote-ivoire',
        tags: ['laravel'],
        title: "Recherche collaborateur pour projet Laravel (Côte d'Ivoire / Francophonie)",
        excerpt:
            'Bonjour à tous 👋. Je suis en train de lancer un projet de création de site web basé sur Laravel et je recherche un(e) collaborateur(trice) motivé(e) pour avancer ensemble sur la partie back-end…',
        author: 'aboubacar.k',
        authorSlug: 'mamadou-f',
        when: 'il y a 5 mois',
        replies: 6,
        views: 412,
        resolved: false,
    },
];

export const FORUM_TAG_COLORS: Record<string, { color: string }> = {
    laravel: { color: '#f0533a' },
    livewire: { color: '#f0533a' },
    framework: { color: '#f0533a' },
    api: { color: '#f0533a' },
    devops: { color: '#3b82f6' },
    docker: { color: '#3b82f6' },
    vue: { color: '#42b883' },
    inertia: { color: '#9333ea' },
    tests: { color: '#eab308' },
    pest: { color: '#eab308' },
    eloquent: { color: '#06b6d4' },
    divers: { color: '#94a3b8' },
};

export const RESOURCES: Resource[] = [
    {
        slug: 'deploy-vps',
        type: 'guide',
        title: 'Déployer Laravel sur un VPS africain',
        desc: 'OVH, Scaleway, Contabo : configuration, HTTPS, déploiement zéro downtime avec Deployer.',
        meta: '12 chapitres',
        level: 'intermédiaire',
        author: 'Omar Sy',
        date: '2026',
    },
    {
        slug: 'eloquent-cheat',
        type: 'cheatsheet',
        title: 'Eloquent — antisèche relations',
        desc: 'hasOne, hasMany, polymorphic, through. Toutes les relations avec exemples et pièges classiques.',
        meta: '2 pages PDF',
        level: 'débutant',
        author: 'Aïssatou Diop',
        date: '2026',
    },
    {
        slug: 'saas-starter',
        type: 'template',
        title: 'Starter kit SaaS fr_SN',
        desc: 'Laravel 13 + Inertia + Tailwind, facturation FCFA, TVA sénégalaise, Wave Payment intégré.',
        meta: 'Starter repo',
        level: 'avancé',
        author: 'Ibrahima Ba',
        date: '2026',
    },
    {
        slug: 'pest-masterclass',
        type: 'vidéo',
        title: 'Masterclass : tester son code',
        desc: '2h30 de Pest, factories, mocking — du test unitaire au test de charge avec K6.',
        meta: '2h30 vidéo',
        level: 'intermédiaire',
        author: 'Khady Ndiaye',
        date: '2026',
    },
    {
        slug: 'queues-guide',
        type: 'guide',
        title: 'Guide des queues Laravel',
        desc: 'Redis, database, SQS : quel driver pour quel usage. Supervisor, Horizon, retry strategies.',
        meta: '8 chapitres',
        level: 'intermédiaire',
        author: 'Cheikh Kane',
        date: '2026',
    },
    {
        slug: 'api-rest',
        type: 'cheatsheet',
        title: 'API REST — bonnes pratiques',
        desc: 'Versioning, pagination, filtrage, erreurs normalisées (RFC 7807). Checklist de 30 points.',
        meta: '1 page PDF',
        level: 'débutant',
        author: 'Ndeye Diouf',
        date: '2026',
    },
    {
        slug: 'livewire-course',
        type: 'vidéo',
        title: 'Livewire 3 — cours complet',
        desc: '4h de vidéo, 18 chapitres, de zéro à la mise en prod.',
        meta: '4h vidéo',
        level: 'intermédiaire',
        author: 'Abdoulaye Ba',
        date: '2026',
    },
    {
        slug: 'filament-template',
        type: 'template',
        title: 'Template admin Filament bilingue',
        desc: 'Filament pré-configuré fr / en / wo, rôles & permissions, audit log, export CSV.',
        meta: 'Starter repo',
        level: 'avancé',
        author: 'Ibrahima Ba',
        date: '2026',
    },
    {
        slug: 'ndank-book',
        type: 'guide',
        title: 'Ndank ndank — livre Laravel en français',
        desc: 'Notre livre collectif, 18 chapitres, 320 pages. Gratuit, libre, écrit par la communauté.',
        meta: '320 pages PDF',
        level: 'débutant',
        author: 'Collectif',
        date: '2026',
    },
    {
        slug: 'security-audit',
        type: 'cheatsheet',
        title: 'Audit sécurité Laravel — checklist',
        desc: '45 points à vérifier avant prod : sessions, CSRF, uploads, headers, secrets.',
        meta: '3 pages PDF',
        level: 'avancé',
        author: 'Fatou Sow',
        date: '2026',
    },
];

export const FORUM_CHANNELS = [
    { slug: 'tous', label: 'Tous les sujets', icon: 'list' },
    { slug: 'resolu', label: 'Résolu', icon: 'check' },
    { slug: 'non-resolu', label: 'Non résolu', icon: 'x' },
    { slug: 'sans-rep', label: 'Aucune réponse', icon: 'msg' },
    { slug: 'populaire', label: 'Populaire', icon: 'heart' },
];
