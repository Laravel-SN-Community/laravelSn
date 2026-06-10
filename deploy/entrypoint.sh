#!/bin/sh
# Shared entrypoint for every production role (web, ssr, queue, scheduler).
# Caches are per-container and rebuilt on boot, so a new image version never
# serves stale config or routes.
set -e

php artisan storage:link --force >/dev/null
php artisan optimize

exec "$@"
