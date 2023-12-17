start:
	docker-compose up

build:
	docker exec -it cttm_web sh -c "pnpm build"
