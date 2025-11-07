# Build stage - Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /app

# Copy the project file
COPY backend.csproj .

# Restore NuGet packages
RUN dotnet restore

# Copy the rest of the application code
COPY . .

# Publish the application (no build step needed, publish does it)
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false


# Runtime stage - Run the application
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

# Copy published application from build stage
COPY --from=build /app/publish .

# Copy appsettings files
COPY appsettings.json .
COPY appsettings.Development.json .

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000

# Expose port
EXPOSE 5000

# Health check (improved)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Start the application
ENTRYPOINT ["dotnet", "backend.dll"]