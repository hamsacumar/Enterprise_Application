# ==========================
# Stage 1: Build the project
# ==========================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the csproj and restore dependencies
COPY ["Admin_Service.csproj", "./"]
RUN dotnet restore "Admin_Service.csproj"

# Copy everything else
COPY . .

# Publish the project
RUN dotnet publish "Admin_Service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================
# Stage 2: Run the project
# ==========================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Configure port and environment variable
ENV ASPNETCORE_URLS=http://+:5125
EXPOSE 5125

# Run the application
ENTRYPOINT ["dotnet", "Admin_Service.dll"]
