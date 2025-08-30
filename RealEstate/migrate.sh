#!/bin/zsh

MIGRATION_NAME=${1:-InitialCreate}

# dotnet ef migrations add $MIGRATION_NAME \
#   --project RealEstate.Infrastructure \
#   --startup-project RealEstate.API

# dotnet ef database update \
#   --project RealEstate.Infrastructure \
#   --startup-project RealEstate.API

# dotnet-ef yükle
# docker compose exec realestate.api dotnet tool install -g dotnet-ef

# dotnet-ef sürümünü kontrol et
# docker compose exec realestate.api /root/.dotnet/tools/dotnet-ef --version


# migration ekle
# docker compose exec -w /src realestate.api \
#   dotnet ef migrations add $MIGRATION_NAME \
#   --project RealEstate.Infrastructure \
#   --startup-project RealEstate.API

# # veritabanını güncelle
docker compose exec -w /src realestate.api \
  dotnet ef database update \
  --project RealEstate.Infrastructure \
  --startup-project RealEstate.API