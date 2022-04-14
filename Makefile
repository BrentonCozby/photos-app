.DEFAULT_GOAL := help

bash:
	@echo "Starting Photos App shell..."
	docker exec -it photos_app.server /bin/bash

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
	@echo "  |_ bash                        - Start a shell session"
	@echo "  |_ rserver                     - Run a command in the server container"
	@echo "  |_ rspa                        - Run a command in the spa container"
	@echo "  |_ logs                        - Run the logs for all containers"
	@echo "  |_ lint                        - Lint everything"
	@echo "  |_ lint-fix                    - Lint everything and auto-fix errors"
	@echo "  |_ copy-server-deps-to-host    - Copy node_modules from the server docker volume to the host machine"
	@echo "  |_ copy-spa-deps-to-host       - Copy node_modules from the spa docker volume to the host machine"
	@echo "  |_ copy-all-deps-to-host       - Copy node_modules from all the docker volumes to the host machine"
	@echo "  |__________________________________________________________________________________________"
	@echo " "

.PHONY:
	bash
	rserver
	rspa
	logs
	lint
	lint-fix
	copy-server-deps-to-host
	copy-spa-deps-to-host
	copy-all-deps-to-host
