# ==========================
# Stage 1: Build the project
# ==========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Disable Windows fallback paths (prevents NuGet fallback errors)
ENV NUGET_PACKAGES=/root/.nuget/packages
ENV NUGET_FALLBACK_PACKAGES=""
ENV NUGET_HTTP_CACHE_PATH=/root/.nuget/v3-cache

# Copy the csproj and restore dependencies
COPY ["be.csproj", "./"]
RUN dotnet restore "be.csproj" --disable-parallel --force

# Copy everything else
COPY . .

# Publish the project (no app host to keep it lightweight)
RUN dotnet publish "be.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================
# Stage 2: Run the project
# ==========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Configure port and environment variable
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Development
EXPOSE 80

# Run the application
ENTRYPOINT ["dotnet", "be.dll"]
