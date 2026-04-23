$service = "file-service"
$version = "v1.0.1"
$env = "dev"

docker buildx build --platform linux/amd64 --build-arg APP_VERSION=${version} -t ghcr.io/raihan-cxo/${service}/${service}-${env}:${version} -t ghcr.io/raihan-cxo/${service}/${service}-${env}:latest . --push