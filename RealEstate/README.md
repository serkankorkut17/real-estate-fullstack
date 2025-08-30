dotnet restore
dotnet build

# DOTNET JWT
dotnet user-jwts create --project RealEstate.API 
dotnet user-jwts list --project RealEstate.API
dotnet user-jwts print {$id} --project RealEstate.API

# Image build
docker build -f RealEstate.API/Dockerfile -t realestate-api:latest .
docker run -d --name realestate-api

# Logları takip et:
docker logs -f realestate-api

# Durdurma / silme:
docker stop realestate-api
docker rm realestate-api
docker ps

# docker-compose
docker compose build
docker compose up -d
docker compose down
docker compose ps

# Console Geç
docker attach realestate.api

# Run production
docker compose -f compose.prod.yaml up --build