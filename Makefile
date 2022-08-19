.DEFAULT_GOAL := help

start:
	@echo "Starting Photos App containers..."
	docker-compose up -d

stop:
	@echo "Stopping Photos App containers..."
	docker-compose stop

bash-db:
	@echo "Starting Photos App db shell..."
	docker exec -it photos_app.db /bin/bash

bash-server:
	@echo "Starting Photos App server shell..."
	docker exec -it photos_app.server /bin/bash

bash-spa:
	@echo "Starting Photos App spa shell..."
	docker exec -it photos_app.spa /bin/bash

rserver:
	docker-compose run --rm server sh -c '$(cmd)'

rspa:
	docker-compose run --rm spa sh -c '$(cmd)'

logs:
	@echo "Following all container logs..."
	docker-compose logs -f --tail=100

lint:
	@echo "Linting Photos App..."
	docker-compose run --rm server sh -c 'npm run lint'

lint-fix:
	@echo "Linting Photos App and fixing errors..."
	docker-compose run --rm server sh -c 'npm run lint:fix'

build-server:
	@echo "Building Docker image for server..."
	docker-compose rm --stop --force -v server || true
	docker volume rm photos-app_server_node_modules || true
	docker-compose build --no-cache server

build-spa:
	@echo "Building Docker image for spa..."
	docker-compose rm --stop --force -v spa || true
	docker volume rm photos-app_spa_node_modules || true
	docker-compose build --no-cache spa

build: build-server build-spa

copy-server-deps-to-host:
	docker-compose cp server:/usr/src/server/node_modules/ ./server

copy-spa-deps-to-host:
	docker-compose cp spa:/usr/src/spa/node_modules/ ./spa

copy-all-deps-to-host: copy-server-deps-to-host copy-spa-deps-to-host


#############################################################
# "Help Documentation"
#############################################################

help:
	@echo "  Photos App Commands"
	@echo "  |"
	@echo "  |_ help (default)              - Show this message"
	@echo "  |_ start                       - Start the Photos App containers"
	@echo "  |_ stop                        - Stop the Photos App containers"
	@echo "  |_ bash-db                     - Start a shell session in the db container"
	@echo "  |_ bash-server                 - Start a shell session in the server container"
	@echo "  |_ bash-spa                    - Start a shell session in the spa container"
	@echo "  |_ rserver                     - Run a command in the server container"
	@echo "  |_ rspa                        - Run a command in the spa container"
	@echo "  |_ logs                        - Run the logs for all containers"
	@echo "  |_ lint                        - Lint everything"
	@echo "  |_ lint-fix                    - Lint everything and auto-fix errors"
	@echo "  |_ build-server                - Build Docker image for server"
	@echo "  |_ build-spa                   - Build Docker image for spa"
	@echo "  |_ build                       - Build all Docker images"
	@echo "  |_ copy-server-deps-to-host    - Copy node_modules from the server docker volume to the host machine"
	@echo "  |_ copy-spa-deps-to-host       - Copy node_modules from the spa docker volume to the host machine"
	@echo "  |_ copy-all-deps-to-host       - Copy node_modules from all the docker volumes to the host machine"
	@echo "  |__________________________________________________________________________________________"
	@echo " "

.PHONY:
	start
	stop
	bash-server
	bash-spa
	rserver
	rspa
	logs
	lint
	lint-fix
	build-server
	build-spa
	build
	copy-server-deps-to-host
	copy-spa-deps-to-host
	copy-all-deps-to-host
