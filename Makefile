.PHONY: up dev down fresh test shell artisan composer npm

# ---------------------------------------------------------------------------
#  Config
# ---------------------------------------------------------------------------
EXEC    := docker compose exec app
EXEC_NS := docker compose exec -e SCOUT_DRIVER=null -e SCOUT_QUEUE=false app
EXEC_NQ := docker compose exec -e SCOUT_QUEUE=false app

SCOUT_MODELS := "App\Models\Article" "App\Models\Thread" "App\Models\User"

# ---------------------------------------------------------------------------
#  Targets
# ---------------------------------------------------------------------------

up:
	@[ -f .env ] || cp .env.example .env
	docker compose up -d --build
	$(EXEC) composer install --no-interaction
	$(EXEC) php artisan key:generate --ansi
	$(EXEC_NS) php artisan migrate:fresh --seeder=DevSeeder
	$(EXEC) php artisan storage:link
	@for model in $(SCOUT_MODELS); do \
		$(EXEC_NQ) php artisan scout:import $$model; \
	done
	$(EXEC) npm install
	@echo ""
	@echo "Ready. Run: make dev"

dev:
	$(EXEC) composer run dev

down:
	docker compose down

fresh:
	@for model in $(SCOUT_MODELS); do \
		$(EXEC) php artisan scout:flush $$model; \
	done
	$(EXEC_NS) php artisan migrate:fresh --seeder=DevSeeder
	@for model in $(SCOUT_MODELS); do \
		$(EXEC_NQ) php artisan scout:import $$model; \
	done

test:
	$(EXEC) composer run ci:check

shell:
	$(EXEC) bash

artisan:
	$(EXEC) php artisan $(cmd)

composer:
	$(EXEC) composer $(cmd)

npm:
	$(EXEC) npm $(cmd)
