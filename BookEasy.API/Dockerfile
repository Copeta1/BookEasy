FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["BookEasy.API.csproj", "."]
RUN dotnet restore "./BookEasy.API.csproj"
COPY . .
RUN dotnet build "BookEasy.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BookEasy.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BookEasy.API.dll"]