.DEFAULT_GOAL := help

.PHONY: help
help: ## List the available commands
	@echo "Photos App Commands"
	@grep --no-filename -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: start
start: ## Start the Photos App containers
	@echo "Starting Photos App containers..."
	docker-compose up -d

.PHONY: stop
stop: ## Stop the Photos App containers
	@echo "Stopping Photos App containers..."
	docker-compose stop

.PHONY: bash-db
bash-db: ## Start a shell session in the db container
	@echo "Starting Photos App db shell..."
	docker exec -it photos_app.db /bin/bash

.PHONY: bash-server
bash-server: ## Start a shell session in the server container
	@echo "Starting Photos App server shell..."
	docker exec -it photos_app.server /bin/bash

.PHONY: bash-spa
bash-spa: ## Start a shell session in the spa container
	@echo "Starting Photos App spa shell..."
	docker exec -it photos_app.spa /bin/bash

.PHONY: rserver
rserver: ## Run a command in the server container
	docker-compose run --rm server sh -c '$(cmd)'

.PHONY: rspa
rspa: ## Run a command in the spa container
	docker-compose run --rm spa sh -c '$(cmd)'

.PHONY: logs
logs: ## Run the logs for all containers
	@echo "Following all container logs..."
	docker-compose logs -f --tail=100

.PHONY: lint
lint: ## Lint everything
	@echo "Linting Photos App..."
	docker-compose run --rm server sh -c 'cd .. && npm run lint'

.PHONY: lint-fix
lint-fix: ## Lint everything and auto-fix errors
	@echo "Linting Photos App and fixing errors..."
	docker-compose run --rm server sh -c 'cd .. && npm run lint:fix'

.PHONY: build-server
build-server: ## Build Docker image for server
	@echo "Building Docker image for server..."
	docker-compose rm --stop --force -v server || true
	docker volume rm photos-app_server_node_modules || true
	docker-compose build --no-cache server

.PHONY: build-spa
build-spa: ## Build Docker image for spa
	@echo "Building Docker image for spa..."
	docker-compose rm --stop --force -v spa || true
	docker volume rm photos-app_spa_node_modules || true
	docker-compose build --no-cache spa

.PHONY: build
build: build-server build-spa ## Build all Docker images

.PHONY: copy-server-deps-to-host
copy-server-deps-to-host: ## Copy node_modules from the server docker volume to the host machine
	docker-compose cp server:/usr/src/server/node_modules/ ./server

.PHONY: copy-spa-deps-to-host
copy-spa-deps-to-host: ## Copy node_modules from the spa docker volume to the host machine
	docker-compose cp spa:/usr/src/spa/node_modules/ ./spa

.PHONY: copy-all-deps-to-host
copy-all-deps-to-host: copy-server-deps-to-host copy-spa-deps-to-host ## Copy node_modules from all the docker volumes to the host machine

