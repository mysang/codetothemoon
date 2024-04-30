start:
	docker-compose up

build:
	docker exec -it cttm sh -c "npm run build" && cp ./CNAME ./docs/CNAME && cp ./CNAME ./docs/_astro/CNAME
