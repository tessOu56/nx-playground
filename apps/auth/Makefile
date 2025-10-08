

.PHONY: docker-product-build
docker-product-build:
	docker build -t ssoui-prod:latest -f .docker/Dockerfile.product .
	docker rmi $$(docker images --filter "dangling=true" -q --no-trunc)

.PHONY: docker-run
docker-run:
	docker run -it --rm \
		-p 9080:8080 \
		-p 9081:8081 \
		ssoui-prod:latest

.PHONY: dagger-publish
dagger-publish:
	export REGISTRY_PWD=${REGISTRY_PWD}
	dagger call build-product \
	--source=. --tag=${IMAGE_TAG} \
	--password=env:REGISTRY_PWD --user=${REGISTRY_USER} \
	--image=ssoui --dockerfile=.docker/Dockerfile.product