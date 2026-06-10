#!/usr/bin/env bash
# Zero-downtime deploy — runs ON THE SERVER from the project directory
# (e.g. /srv/laravel-sn). Usage: ./deploy.sh <image-tag>
#
# Strategy (rolling update behind Traefik):
#   1. Pull the new image and pin its tag in .env
#   2. Run migrations in a one-off container (migrations must be
#      backward-compatible — see the runbook)
#   3. Start a SECOND app container with the new image, wait until its
#      healthcheck passes (Traefik now load-balances old + new)
#   4. Gracefully stop the old container (in-flight requests drain)
#   5. Recreate ssr / queue / scheduler with the new image
set -euo pipefail
cd "$(dirname "$0")"

TAG="${1:?Usage: ./deploy.sh <image-tag>}"
COMPOSE="docker compose -f docker-compose.prod.yml"
HEALTH_TIMEOUT=120

if ! grep -q '^APP_IMAGE_TAG=' .env; then
    echo "APP_IMAGE_TAG=" >> .env
fi
sed -i "s|^APP_IMAGE_TAG=.*|APP_IMAGE_TAG=${TAG}|" .env

echo "==> Pulling image tag ${TAG}"
$COMPOSE pull --quiet app

echo "==> Running database migrations"
$COMPOSE run --rm --no-deps app php artisan migrate --force

OLD_CONTAINERS=$($COMPOSE ps -q app)

echo "==> Starting new app container"
$COMPOSE up -d --no-deps --no-recreate --scale app=2 app

NEW_CONTAINER=""
for id in $($COMPOSE ps -q app); do
    if ! grep -q "$id" <<< "$OLD_CONTAINERS"; then
        NEW_CONTAINER="$id"
    fi
done

if [[ -z "$NEW_CONTAINER" ]]; then
    echo "ERROR: could not identify the new app container" >&2
    exit 1
fi

echo "==> Waiting for ${NEW_CONTAINER:0:12} to become healthy"
elapsed=0
until [[ "$(docker inspect -f '{{.State.Health.Status}}' "$NEW_CONTAINER")" == "healthy" ]]; do
    if [[ "$(docker inspect -f '{{.State.Health.Status}}' "$NEW_CONTAINER")" == "unhealthy" ]] \
        || (( elapsed >= HEALTH_TIMEOUT )); then
        echo "ERROR: new container failed its healthcheck — rolling back" >&2
        docker logs --tail 50 "$NEW_CONTAINER" >&2 || true
        docker stop -t 10 "$NEW_CONTAINER" >/dev/null && docker rm "$NEW_CONTAINER" >/dev/null
        exit 1
    fi
    sleep 3
    elapsed=$((elapsed + 3))
done

echo "==> Draining old app container(s)"
for id in $OLD_CONTAINERS; do
    docker stop -t 30 "$id" >/dev/null
    docker rm "$id" >/dev/null
done

echo "==> Updating ssr, queue worker and scheduler"
$COMPOSE up -d --no-deps ssr queue scheduler

echo "==> Pruning old images"
docker image prune -f >/dev/null

echo "==> Deploy of ${TAG} complete"
