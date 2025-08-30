#!/bin/zsh

dotnet build RealEstate.API/RealEstate.API.csproj
cd RealEstate.API

# Lokal IP adresini al
IP=$(ipconfig getifaddr en0)
# IP=$(ipconfig getifaddr en1)

echo "----------------------------------------"
echo "Real Estate API is starting..."
echo "You can access the API at:"
echo "  http://localhost:8000/swagger"
echo "  http://$IP:8000/swagger"
echo "----------------------------------------"

# dotnet watch run
dotnet watch run --urls "http://localhost:8000;http://0.0.0.0:8000"