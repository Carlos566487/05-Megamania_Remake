# ================================================================
#  publish.ps1 — Conecta ao repositório remoto e publica o projeto
#  Uso: .\publish.ps1
# ================================================================

Write-Host ""
Write-Host "══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  MEGAMANIA REMAKE — Publicação no GitHub" -ForegroundColor Yellow
Write-Host "══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 1. Renomeia branch para 'main' (padrão GitHub)
Write-Host "[1/4] Renomeando branch para 'main'..." -ForegroundColor Green
git branch -M main

# 2. Adiciona o remote origin (ignora erro se já existir)
Write-Host "[2/4] Configurando remote origin..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin https://github.com/Carlos566487/05-Megamania_Remake.git

# 3. Confirma configuração
Write-Host "[3/4] Verificando remote configurado:" -ForegroundColor Green
git remote -v

# 4. Push para o GitHub
Write-Host ""
Write-Host "[4/4] Enviando commits para o GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅  Projeto publicado com sucesso!" -ForegroundColor Green
    Write-Host "    https://github.com/Carlos566487/05-Megamania_Remake" -ForegroundColor Cyan
} else {
    Write-Host "❌  Erro no push. Verifique sua autenticação no GitHub." -ForegroundColor Red
    Write-Host "    Dica: use 'gh auth login' ou configure um Personal Access Token." -ForegroundColor Yellow
}
Write-Host ""
