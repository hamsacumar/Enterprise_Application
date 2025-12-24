# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ["WorkersService.csproj", "./"]
RUN dotnet restore "WorkersService.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "WorkersService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:7193
EXPOSE 7193

ENTRYPOINT ["dotnet", "WorkersService.dll"]
