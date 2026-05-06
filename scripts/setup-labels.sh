#!/usr/bin/env bash
#
# Crée tous les labels du repo en une commande.
# Pré-requis : GitHub CLI installé et authentifié (`gh auth login`)
# Usage : ./scripts/setup-labels.sh
#

set -euo pipefail

REPO="${REPO:-Laravel-SN-Community/laravel.sn-v2}"

echo "🏷  Setup des labels pour $REPO"
echo ""

# Fonction pour créer/mettre à jour un label sans erreur s'il existe déjà
create_label() {
    local name="$1"
    local color="$2"
    local description="$3"

    if gh label create "$name" --color "$color" --description "$description" --repo "$REPO" 2>/dev/null; then
        echo "  ✅ Créé : $name"
    else
        gh label edit "$name" --color "$color" --description "$description" --repo "$REPO" >/dev/null 2>&1
        echo "  🔄 Mis à jour : $name"
    fi
}

echo "📦 Types"
create_label "type:bug"          "d73a4a" "Quelque chose ne fonctionne pas correctement"
create_label "type:feature"      "0e8a16" "Nouvelle fonctionnalité"
create_label "type:enhancement"  "1d76db" "Amélioration d'une fonctionnalité existante"
create_label "type:docs"         "586069" "Documentation uniquement"
create_label "type:chore"        "c5def5" "Maintenance, dépendances, configuration"
create_label "type:refactor"     "fbca04" "Refactoring sans changement fonctionnel"
create_label "type:test"         "0075ca" "Ajout ou correction de tests"

echo ""
echo "🔥 Priorités"
create_label "priority:critical" "b60205" "Bloque un cas d'usage majeur, à corriger immédiatement"
create_label "priority:high"     "d93f0b" "Important, à traiter rapidement"
create_label "priority:medium"   "fbca04" "Modéré"
create_label "priority:low"      "0e8a16" "Confort, à traiter quand on a le temps"

echo ""
echo "📊 Statuts"
create_label "status:needs-triage"   "ededed" "À évaluer par un mainteneur"
create_label "status:blocked"        "000000" "En attente de quelque chose pour avancer"
create_label "status:in-progress"    "0075ca" "Quelqu'un travaille dessus"
create_label "status:needs-review"   "8957e5" "PR en attente de review"
create_label "status:wontfix"        "ffffff" "Ne sera pas traité, raison à expliquer"
create_label "status:duplicate"      "cccccc" "Issue ou PR dupliquée"

echo ""
echo "🌟 Communauté"
create_label "good-first-issue"   "ff6ec7" "Accessible aux nouveaux contributeurs"
create_label "help-wanted"        "008672" "Appel à contribution"
create_label "hacktoberfest"      "ff8c00" "Éligible Hacktoberfest"

echo ""
echo "🎨 Domaines"
create_label "scope:articles"     "c2e0c6" "Articles, blog, contenu éditorial"
create_label "scope:events"       "c2e0c6" "Événements, meetups, agenda"
create_label "scope:podcast"      "c2e0c6" "Podcast et épisodes"
create_label "scope:resources"    "c2e0c6" "Catalogue de ressources"
create_label "scope:auth"         "c2e0c6" "Authentification, comptes"
create_label "scope:ui"           "c2e0c6" "UI, design, composants"
create_label "scope:api"          "c2e0c6" "API publique"
create_label "scope:infra"        "c2e0c6" "Infrastructure, déploiement, CI"
create_label "scope:seo"          "c2e0c6" "SEO, méta tags, sitemap"
create_label "scope:a11y"         "c2e0c6" "Accessibilité"
create_label "scope:i18n"         "c2e0c6" "Internationalisation, traductions"

echo ""
echo "🔧 Divers"
create_label "dependencies"        "0366d6" "Mise à jour de dépendances"
create_label "breaking-change"     "b60205" "Changement non rétro-compatible"
create_label "security"            "ee0701" "Lié à la sécurité"
create_label "performance"         "fef2c0" "Lié à la performance"
create_label "ignore-for-release"  "ededed" "Exclure des release notes auto"

echo ""
echo "🗑  Suppression des labels par défaut inutiles"
for default_label in "good first issue" "help wanted" "wontfix" "invalid" "question"; do
    if gh label delete "$default_label" --repo "$REPO" --yes 2>/dev/null; then
        echo "  🗑  Supprimé : $default_label"
    fi
done

echo ""
echo "✨ Setup des labels terminé pour $REPO"
