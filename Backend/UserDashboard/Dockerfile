# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy just the project file
COPY ["be.csproj", "./"]

# Restore dependencies
RUN dotnet restore "be.csproj"

# Copy the rest of the source code
COPY . .

# Build and publish the project
RUN dotnet build "be.csproj" -c Release -o /app/build
RUN dotnet publish "be.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/publish .

# Configure port and environment variable
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Development
EXPOSE 5000

# Set the entry point
ENTRYPOINT ["dotnet", "be.dll"]