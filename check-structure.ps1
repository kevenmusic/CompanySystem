# Скрипт для проверки структуры проекта
Write-Host "🔍 Проверка структуры проекта CompanySystem..." -ForegroundColor Green

function Check-Path {
    param($Path, $Description)
    if (Test-Path $Path) {
        Write-Host "✅ $Description`: $Path" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Description`: $Path" -ForegroundColor Red
        return $false
    }
}

function List-Directory {
    param($Path, $Description)
    if (Test-Path $Path) {
        Write-Host "`n📁 Содержимое $Description ($Path):" -ForegroundColor Cyan
        Get-ChildItem $Path | ForEach-Object {
            $type = if ($_.PSIsContainer) { "📁" } else { "📄" }
            Write-Host "   $type $($_.Name)" -ForegroundColor White
        }
    }
}

Write-Host "`n=== ОСНОВНЫЕ ДИРЕКТОРИИ ===" -ForegroundColor Yellow
$backendExists = Check-Path "backend" "Backend директория"
$frontendExists = Check-Path "frontend" "Frontend директория"

Write-Host "`n=== BACKEND СТРУКТУРА ===" -ForegroundColor Yellow
if ($backendExists) {
    List-Directory "backend" "backend"
    
    $companySystemExists = Check-Path "backend/CompanySystem" "CompanySystem проект"
    if ($companySystemExists) {
        List-Directory "backend/CompanySystem" "CompanySystem"
        
        # Проверяем проекты
        Check-Path "backend/CompanySystem/CompanySystem.Web" "Web проект"
        Check-Path "backend/CompanySystem/CompanySystem.Application" "Application проект"
        Check-Path "backend/CompanySystem/CompanySystem.Domain" "Domain проект"
        Check-Path "backend/CompanySystem/CompanySystem.Shared" "Shared проект"
        
        # Проверяем Dockerfile
        $dockerfileExists = Check-Path "backend/CompanySystem/Dockerfile" "Оригинальный Dockerfile"
        $dockerfileDevExists = Check-Path "backend/CompanySystem/Dockerfile.dev" "Development Dockerfile"
        
        if (!$dockerfileExists -and !$dockerfileDevExists) {
            Write-Host "⚠️  Не найден ни один Dockerfile в backend/CompanySystem/" -ForegroundColor Yellow
        }
        
        # Проверяем .csproj файлы  
        if (Test-Path "backend/CompanySystem/CompanySystem.Web") {
            List-Directory "backend/CompanySystem/CompanySystem.Web" "CompanySystem.Web"
            Check-Path "backend/CompanySystem/CompanySystem.Web/CompanySystem.Web.csproj" "Web csproj"
            Check-Path "backend/CompanySystem/CompanySystem.Web/appsettings.json" "appsettings.json"
        }
    }
}

Write-Host "`n=== FRONTEND СТРУКТУРА ===" -ForegroundColor Yellow
if ($frontendExists) {
    List-Directory "frontend" "frontend"
    
    if (Test-Path "frontend/tailwindcss4") {
        List-Directory "frontend/tailwindcss4" "tailwindcss4"
        Check-Path "frontend/tailwindcss4/package.json" "package.json"
        Check-Path "frontend/tailwindcss4/Dockerfile" "Frontend Dockerfile"
    }
}

Write-Host "`n=== DOCKER ФАЙЛЫ ===" -ForegroundColor Yellow
Check-Path "docker-compose.yml" "Docker Compose"
Check-Path "docker-compose.simple.yml" "Упрощенный Docker Compose"
Check-Path "nginx.conf" "Nginx конфигурация"

Write-Host "`n=== СКРИПТЫ ===" -ForegroundColor Yellow
Check-Path "start.sh" "Bash скрипт запуска"
Check-Path "start.ps1" "PowerShell скрипт запуска"
Check-Path "migrate.sh" "Скрипт миграций"

Write-Host "`n=== РЕКОМЕНДАЦИИ ===" -ForegroundColor Cyan

if (!(Test-Path "backend/CompanySystem/Dockerfile") -and !(Test-Path "backend/CompanySystem/Dockerfile.dev")) {
    Write-Host "📝 Нужно создать Dockerfile в backend/CompanySystem/" -ForegroundColor Yellow
}

if (!(Test-Path "frontend/tailwindcss4/package.json")) {
    Write-Host "📝 Проверьте путь к frontend проекту" -ForegroundColor Yellow
}

Write-Host "`n✅ Проверка завершена!" -ForegroundColor Green