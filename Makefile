.DEFAULT_GOAL := help

bash:
	@echo "Starting Photos App shell..."
	docker exec -it photos_app.server /bin/bash

logs:
	@echo "Following all container logs..."
	docker-compose logs -f --tail=0

lint:
	@echo "Linting Photos App..."
	docker-compose run --rm server sh -c 'npm run lint'

lint-fix:
	@echo "Linting Photos App and fixing errors..."
	docker-compose run --rm server sh -c 'npm run lint:fix'


#############################################################
# "Help Documentation"
#############################################################

help:
	@echo "  Photos App Commands"
	@echo "  |"
	@echo "  |_ help (default)        - Show this message"
	@echo "  |_ bash                 - Start a shell session"
	@echo "  |__________________________________________________________________________________________"
	@echo " "

.PHONY:
	bash
	lint
	lint-fix
