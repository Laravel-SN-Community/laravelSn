.PHONY: up dev fresh test artisan composer npm

# ---------------------------------------------------------------------------
#  Targets
# ---------------------------------------------------------------------------

up:
	@[ -f .env ] || cp .env.example .env
	composer install --no-interaction
	php artisan key:generate --ansi
	@php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
	php artisan migrate:fresh --seeder=DevSeeder
	php artisan storage:link
	npm install
	@echo ""
	@echo "Ready. Run: make dev"

dev:
	composer run dev

fresh:
	@php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
	php artisan migrate:fresh --seeder=DevSeeder

test:
	composer run ci:check

artisan:
	php artisan $(cmd)

composer:
	composer $(cmd)

npm:
	npm $(cmd)
