# ==========================
# Stage 1: Build the project
# ==========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj and restore dependencies
COPY ["WorkersService.csproj", "./"]
RUN dotnet restore "WorkersService.csproj"

# Copy everything else
COPY . .

# Publish the project
RUN dotnet publish "WorkersService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================
# Stage 2: Run the project
# ==========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Configure port and environment variable
ENV ASPNETCORE_URLS=http://+:7193
EXPOSE 7193

# Run the application
ENTRYPOINT ["dotnet", "WorkersService.dll"]
