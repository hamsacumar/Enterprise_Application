# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ["Admin_Service.csproj", "./"]
RUN dotnet restore "Admin_Service.csproj"
# Copy csproj and restore as distinct layers
COPY ["Admin_Service.csproj", "./"]
RUN dotnet restore "Admin_Service.csproj"

# Copy everything else and build
# Copy everything else and build
COPY . .
RUN dotnet publish "Admin_Service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "Admin_Service.dll"]