FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY Domain/Domain.csproj ./Domain/
COPY Application/Application.csproj ./Application/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/
COPY Shared/Shared.csproj ./Shared/

RUN dotnet restore Infrastructure/Infrastructure.csproj

COPY Domain/. ./Domain/
COPY Application/. ./Application/
COPY Infrastructure/. ./Infrastructure/
COPY Shared/. ./Shared/

RUN dotnet publish Infrastructure/Infrastructure.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/out .

EXPOSE 80

ENTRYPOINT ["dotnet", "Infrastructure.dll"]
