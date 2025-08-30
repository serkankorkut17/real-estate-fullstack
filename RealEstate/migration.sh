#!/bin/zsh
set -euo pipefail

SERVICE=realestate.api
WORKDIR=/src
EF=/root/.dotnet/tools/dotnet-ef

CMD=${1:-update}        # add | update | remove
NAME=${2:-Migration}    # add/remove için migration adı

# Container ayakta olsun
docker compose up -d ${SERVICE}

# dotnet-ef yoksa kur (EF Core 8 ile uyumlu sürüm)
docker compose exec ${SERVICE} sh -lc "test -x ${EF} || dotnet tool install -g dotnet-ef --version 8.*"

case "$CMD" in
  add)
    if [[ -z "${NAME}" || "${NAME}" = "Migration" ]]; then
      echo "Usage: ./migrate.sh add <MigrationName>"
      exit 1
    fi
    docker compose exec -w ${WORKDIR} ${SERVICE} ${EF} migrations add "${NAME}" \
      --project RealEstate.Infrastructure \
      --startup-project RealEstate.API
    ;;
  remove)
    docker compose exec -w ${WORKDIR} ${SERVICE} ${EF} migrations remove \
      --project RealEstate.Infrastructure \
      --startup-project RealEstate.API
    ;;
  update|*)
    docker compose exec -w ${WORKDIR} ${SERVICE} ${EF} database update \
      --project RealEstate.Infrastructure \
      --startup-project RealEstate.API
    ;;
esac