FROM php:8.4-cli-alpine

# Runtime libraries (stay in the final image)
RUN apk add --no-cache \
    bash git curl \
    libpng libjpeg-turbo libwebp freetype \
    libzip icu-libs libpq \
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
