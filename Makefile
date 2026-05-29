.PHONY: up dev down fresh test shell artisan composer npm

up:
	@[ -f .env ] || cp .env.example .env
	docker compose up -d --build
	docker compose exec app composer install --no-interaction
	docker compose exec app php artisan key:generate --ansi
	docker compose exec app php artisan migrate:fresh --seed
	docker compose exec app php artisan storage:link
	docker compose exec -e SCOUT_QUEUE=false app php artisan scout:import "App\Models\Article"
	docker compose exec -e SCOUT_QUEUE=false app php artisan scout:import "App\Models\Thread"
	docker compose exec -e SCOUT_QUEUE=false app php artisan scout:import "App\Models\User"
	docker compose exec app npm install
	@echo ""
	@echo "Ready. Run: make dev"

dev:
	docker compose exec app composer run dev

down:
	docker compose down

fresh:
	docker compose exec app php artisan scout:flush "App\Models\Article"
	docker compose exec app php artisan scout:flush "App\Models\Thread"
	docker compose exec app php artisan scout:flush "App\Models\User"
	docker compose exec app php artisan migrate:fresh --seed
	docker compose exec -e SCOUT_QUEUE=false app php artisan scout:import "App\Models\Article"
	docker compose exec -e SCOUT_QUEUE=false app php artisan scout:import "App\Models\Thread"
	docker compose exec -e SCOUT_QUEUE=false app php artisan scout:import "App\Models\User"

test:
	docker compose exec app composer run ci:check

shell:
	docker compose exec app bash

artisan:
	docker compose exec app php artisan $(cmd)

composer:
	docker compose exec app composer $(cmd)

npm:
	docker compose exec app npm $(cmd)
