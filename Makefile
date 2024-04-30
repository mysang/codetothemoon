start:
	docker-compose up

build:
	docker exec -it cttm sh -c "MODE=production npm run build" && cp ./CNAME ./docs/CNAME
