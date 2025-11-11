# Run Unit Tests Only
Write-Host "Running Unit Tests..." -ForegroundColor Cyan
dotnet test --filter "Category=Unit" --verbosity normal

