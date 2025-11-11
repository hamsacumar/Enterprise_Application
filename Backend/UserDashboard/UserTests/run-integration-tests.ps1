# Run Integration Tests Only
Write-Host "Running Integration Tests..." -ForegroundColor Cyan
dotnet test --filter "Category=Integration" --verbosity normal

