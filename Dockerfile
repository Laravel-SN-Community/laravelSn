# syntax=docker/dockerfile:1

# ============================================================================
# Dev — used by docker-compose.yml (code is bind-mounted, deps installed
# by `make up`). Kept as the first stage so `docker build .` without a
# target still produces the historical dev image.
# ============================================================================
FROM php:8.4-cli-alpine AS dev

# Runtime libraries (stay in the final image)
RUN apk add --no-cache \
    bash git curl \
    libpng libjpeg-turbo libwebp freetype \
    libzip icu-libs icu-data-full libpq \
    nodejs npm

# Build-only deps — compiled in, then removed in the same layer
RUN apk add --no-cache --virtual .build-deps \
        autoconf g++ make \
        libpng-dev libjpeg-turbo-dev libwebp-dev freetype-dev \
        libzip-dev icu-dev postgresql-dev oniguruma-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql pgsql gd intl bcmath zip mbstring pcntl exif \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN git config --global --add safe.directory /var/www/html

WORKDIR /var/www/html

CMD ["sleep", "infinity"]

# ============================================================================
# Prod base — FrankenPHP (Caddy + PHP in one binary) with the extensions
# the app needs. pdo_mysql is only used by the one-off legacy data import.
# ============================================================================
FROM dunglas/frankenphp:1-php8.4-alpine AS prod-base

RUN install-php-extensions \
    pdo_pgsql pgsql pdo_mysql gd intl bcmath zip pcntl exif opcache redis

# ============================================================================
# Build — composer vendor, Wayfinder generation and Vite assets (the
# Wayfinder Vite plugin shells out to `php artisan`, so PHP + vendor must
# be present while the frontend builds).
# ============================================================================
FROM prod-base AS build

RUN apk add --no-cache nodejs npm git

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Build-only key: artisan must boot during the build, but no real secret
# may be baked into the image. The runtime APP_KEY comes from the env file.
ENV APP_ENV=production \
    APP_KEY=base64:2ZMCcb5/0hxUGLTB4Kp2tlHvNnBKzZGtcEwJ4bLzzPw=

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --no-scripts --prefer-dist

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# storage/ is excluded from the build context (local runtime data); artisan
# needs the skeleton to boot, and the named volume seeds itself from it.
RUN mkdir -p \
        storage/app/private \
        storage/app/public \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/testing \
        storage/framework/views \
        storage/logs

RUN composer dump-autoload --optimize --classmap-authoritative --no-dev \
    && php artisan package:discover --ansi

# Builds public/build (client) and bootstrap/ssr (server bundle), then
# drops devDependencies — the SSR bundle imports its runtime deps from
# node_modules, so production deps ship with the image.
RUN npm run build && npm prune --omit=dev

# ============================================================================
# Prod — final runtime image. One image runs every role (web, ssr, queue,
# scheduler); docker-compose.prod.yml picks the command per service.
# ============================================================================
FROM prod-base AS prod

# node is required at runtime by `php artisan inertia:start-ssr`
RUN apk add --no-cache nodejs

ENV SERVER_NAME=:8080

RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY deploy/php.prod.ini "$PHP_INI_DIR/conf.d/99-app.ini"

WORKDIR /app

COPY --from=build /app /app

COPY deploy/entrypoint.sh /usr/local/bin/app-entrypoint
RUN chmod +x /usr/local/bin/app-entrypoint

EXPOSE 8080

ENTRYPOINT ["app-entrypoint"]
CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile"]
